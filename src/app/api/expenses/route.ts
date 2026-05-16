import { NextResponse } from "next/server";
import { z } from "zod";
import { apiError, requirePermission } from "@/lib/api";
import { prisma } from "@/lib/db";

const expenseSchema = z.object({
  category: z.string().min(1),
  amount: z.coerce.number().min(0),
  branchId: z.string().min(1),
  recordedById: z.string().min(1),
  notes: z.string().optional(),
  date: z.string()
});

export async function GET(request: Request) {
  const guard = requirePermission("reports:read");
  if (guard.response) return guard.response;
  const { searchParams } = new URL(request.url);

  try {
    const expenses = await prisma.expense.findMany({
      where: {
        branchId: searchParams.get("branchId") || undefined,
        date: {
          gte: searchParams.get("from") ? new Date(searchParams.get("from")!) : undefined,
          lte: searchParams.get("to") ? new Date(searchParams.get("to")!) : undefined
        }
      },
      include: { branch: true, recordedBy: true },
      orderBy: { date: "desc" }
    });
    return NextResponse.json(expenses);
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request) {
  const guard = requirePermission("expenses:create");
  if (guard.response) return guard.response;

  try {
    const body = expenseSchema.parse(await request.json());
    const expense = await prisma.expense.create({
      data: {
        category: body.category,
        amount: body.amount,
        branchId: body.branchId,
        recordedById: body.recordedById,
        notes: body.notes,
        date: new Date(body.date)
      }
    });
    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
