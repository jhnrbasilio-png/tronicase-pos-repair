import { NextResponse } from "next/server";
import { z } from "zod";
import { apiError, requirePermission } from "@/lib/api";
import { prisma } from "@/lib/db";

const productSchema = z.object({
  name: z.string().min(1),
  sku: z.string().min(1),
  barcode: z.string().min(1),
  category: z.string().min(1),
  brand: z.string().min(1),
  compatibility: z.string().min(1),
  costPrice: z.coerce.number().min(0),
  sellingPrice: z.coerce.number().min(0),
  lowStockAlert: z.coerce.number().int().min(0).default(5),
  branchStocks: z.array(z.object({ branchId: z.string(), quantity: z.coerce.number().int().min(0) })).default([])
});

export async function GET(request: Request) {
  const guard = requirePermission("dashboard:read");
  if (guard.response) return guard.response;
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";

  try {
    const products = await prisma.product.findMany({
      where: q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { sku: { contains: q, mode: "insensitive" } },
              { barcode: { contains: q, mode: "insensitive" } }
            ]
          }
        : undefined,
      include: { stocks: { include: { branch: true } } },
      orderBy: { name: "asc" }
    });
    return NextResponse.json(products);
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request) {
  const guard = requirePermission("products:write");
  if (guard.response) return guard.response;

  try {
    const body = productSchema.parse(await request.json());
    const product = await prisma.product.create({
      data: {
        name: body.name,
        sku: body.sku,
        barcode: body.barcode,
        category: body.category,
        brand: body.brand,
        compatibility: body.compatibility,
        costPrice: body.costPrice,
        sellingPrice: body.sellingPrice,
        lowStockAlert: body.lowStockAlert,
        stocks: {
          create: body.branchStocks.map((stock) => ({ branchId: stock.branchId, quantity: stock.quantity }))
        }
      },
      include: { stocks: true }
    });
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
