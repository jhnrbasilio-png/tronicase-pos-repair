import { NextResponse } from "next/server";
import { z } from "zod";
import { apiError, requirePermission } from "@/lib/api";
import { prisma } from "@/lib/db";

const updateSchema = z.object({
  category: z.string().min(1).optional(),
  amount: z.coerce.number().min(0).optional(),
  branchId: z.string().optional(),
  notes: z.string().optional(),
  date: z.string().optional()
});

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const guard = requirePermission("expenses:write");
  if (guard.response) return guard.response;

  try {
    const body = updateSchema.parse(await request.json());
    const expense = await prisma.expense.update({
      where: { id: params.id },
      data: { ...body, date: body.date ? new Date(body.date) : undefined }
    });
    return NextResponse.json(expense);
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const guard = requirePermission("expenses:write");
  if (guard.response) return guard.response;

  try {
    await prisma.expense.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}
