import { NextResponse } from "next/server";
import { z } from "zod";
import { apiError, requirePermission } from "@/lib/api";
import { prisma } from "@/lib/db";

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  sku: z.string().min(1).optional(),
  barcode: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  brand: z.string().min(1).optional(),
  compatibility: z.string().min(1).optional(),
  costPrice: z.coerce.number().min(0).optional(),
  sellingPrice: z.coerce.number().min(0).optional(),
  lowStockAlert: z.coerce.number().int().min(0).optional()
});

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const guard = requirePermission("dashboard:read");
  if (guard.response) return guard.response;

  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: { stocks: { include: { branch: true } } }
    });
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    return NextResponse.json(product);
  } catch (error) {
    return apiError(error);
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const guard = requirePermission("products:write");
  if (guard.response) return guard.response;

  try {
    const data = updateSchema.parse(await request.json());
    const product = await prisma.product.update({ where: { id: params.id }, data });
    return NextResponse.json(product);
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const guard = requirePermission("products:write");
  if (guard.response) return guard.response;

  try {
    await prisma.product.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}
