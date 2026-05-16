import { NextResponse } from "next/server";
import { z } from "zod";
import { apiError, requirePermission } from "@/lib/api";
import { prisma } from "@/lib/db";

const saleSchema = z.object({
  branchId: z.string().min(1),
  cashierId: z.string().min(1),
  paymentMethod: z.enum(["CASH", "GCASH"]),
  discount: z.coerce.number().min(0).default(0),
  amountTendered: z.coerce.number().min(0).default(0),
  items: z.array(z.object({ productId: z.string(), quantity: z.coerce.number().int().min(1) })).min(1)
});

export async function GET(request: Request) {
  const guard = requirePermission("reports:read");
  if (guard.response) return guard.response;
  const { searchParams } = new URL(request.url);

  try {
    const sales = await prisma.sale.findMany({
      where: {
        branchId: searchParams.get("branchId") || undefined,
        cashierId: searchParams.get("cashierId") || undefined,
        createdAt: {
          gte: searchParams.get("from") ? new Date(searchParams.get("from")!) : undefined,
          lte: searchParams.get("to") ? new Date(searchParams.get("to")!) : undefined
        }
      },
      include: { branch: true, cashier: true, items: { include: { product: true } } },
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(sales);
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request) {
  const guard = requirePermission("pos:write");
  if (guard.response) return guard.response;

  try {
    const body = saleSchema.parse(await request.json());
    const sale = await prisma.$transaction(async (tx) => {
      const products = await tx.product.findMany({ where: { id: { in: body.items.map((item) => item.productId) } } });
      const subtotal = body.items.reduce((sum, item) => {
        const product = products.find((candidate) => candidate.id === item.productId);
        if (!product) throw new Error("Product not found");
        return sum + Number(product.sellingPrice) * item.quantity;
      }, 0);
      const total = Math.max(0, subtotal - body.discount);

      for (const item of body.items) {
        const stock = await tx.stock.findUnique({
          where: { productId_branchId: { productId: item.productId, branchId: body.branchId } }
        });
        if (!stock || stock.quantity < item.quantity) throw new Error("Insufficient stock");
      }

      const created = await tx.sale.create({
        data: {
          receiptNumber: `TC-${Date.now()}`,
          type: "POS",
          branchId: body.branchId,
          cashierId: body.cashierId,
          paymentMethod: body.paymentMethod,
          subtotal,
          discount: body.discount,
          total,
          amountTendered: body.amountTendered,
          items: {
            create: body.items.map((item) => {
              const product = products.find((candidate) => candidate.id === item.productId)!;
              return { productId: item.productId, quantity: item.quantity, unitPrice: product.sellingPrice };
            })
          }
        },
        include: { items: { include: { product: true } }, branch: true, cashier: true }
      });

      for (const item of body.items) {
        await tx.stock.update({
          where: { productId_branchId: { productId: item.productId, branchId: body.branchId } },
          data: { quantity: { decrement: item.quantity } }
        });
      }

      return created;
    });

    return NextResponse.json(sale, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
