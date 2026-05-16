import { NextResponse } from "next/server";
import { z } from "zod";
import { apiError, requirePermission } from "@/lib/api";
import { prisma } from "@/lib/db";

const transferSchema = z.object({
  productId: z.string().min(1),
  fromBranchId: z.string().min(1),
  toBranchId: z.string().min(1),
  quantity: z.coerce.number().int().min(1),
  notes: z.string().optional()
});

export async function GET() {
  const guard = requirePermission("products:write");
  if (guard.response) return guard.response;

  try {
    const transfers = await prisma.stockTransfer.findMany({
      include: { product: true, fromBranch: true, toBranch: true },
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(transfers);
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request) {
  const guard = requirePermission("products:write");
  if (guard.response) return guard.response;

  try {
    const body = transferSchema.parse(await request.json());
    const transfer = await prisma.$transaction(async (tx) => {
      const fromStock = await tx.stock.findUnique({
        where: { productId_branchId: { productId: body.productId, branchId: body.fromBranchId } }
      });
      if (!fromStock || fromStock.quantity < body.quantity) throw new Error("Insufficient source stock");

      await tx.stock.update({
        where: { productId_branchId: { productId: body.productId, branchId: body.fromBranchId } },
        data: { quantity: { decrement: body.quantity } }
      });
      await tx.stock.upsert({
        where: { productId_branchId: { productId: body.productId, branchId: body.toBranchId } },
        create: { productId: body.productId, branchId: body.toBranchId, quantity: body.quantity },
        update: { quantity: { increment: body.quantity } }
      });
      return tx.stockTransfer.create({ data: body });
    });
    return NextResponse.json(transfer, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
