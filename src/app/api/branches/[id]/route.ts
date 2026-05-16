import { NextResponse } from "next/server";
import { z } from "zod";
import { apiError, requirePermission } from "@/lib/api";
import { prisma } from "@/lib/db";

const branchUpdateSchema = z.object({
  slug: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  address: z.string().min(1).optional(),
  contactNumber: z.string().optional()
});

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const guard = requirePermission("branches:write");
  if (guard.response) return guard.response;

  try {
    const body = branchUpdateSchema.parse(await request.json());
    const branch = await prisma.branch.update({ where: { id: params.id }, data: body });
    return NextResponse.json(branch);
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const guard = requirePermission("branches:write");
  if (guard.response) return guard.response;

  try {
    await prisma.branch.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}
