import { NextResponse } from "next/server";
import { z } from "zod";
import { apiError, requirePermission } from "@/lib/api";
import { prisma } from "@/lib/db";

const branchSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  address: z.string().min(1),
  contactNumber: z.string().optional()
});

export async function GET() {
  const guard = requirePermission("dashboard:read");
  if (guard.response) return guard.response;

  try {
    const branches = await prisma.branch.findMany({ orderBy: { name: "asc" }, include: { users: true } });
    return NextResponse.json(branches);
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request) {
  const guard = requirePermission("branches:write");
  if (guard.response) return guard.response;

  try {
    const body = branchSchema.parse(await request.json());
    const branch = await prisma.branch.create({ data: body });
    return NextResponse.json(branch, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
