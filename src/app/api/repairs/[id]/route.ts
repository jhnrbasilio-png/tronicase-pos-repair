import { NextResponse } from "next/server";
import { z } from "zod";
import { apiError, requirePermission } from "@/lib/api";
import { prisma } from "@/lib/db";

const statusSchema = z.object({
  status: z.enum(["PENDING", "DIAGNOSING", "WAITING_PARTS", "IN_PROGRESS", "COMPLETED", "RELEASED", "CANCELLED"]).optional(),
  diagnosis: z.string().optional(),
  laborFee: z.coerce.number().min(0).optional(),
  customerSignature: z.string().optional(),
  beforePhotoUrl: z.string().optional(),
  afterPhotoUrl: z.string().optional(),
  warrantyUntil: z.string().optional()
});

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const guard = requirePermission("repairs:write");
  if (guard.response) return guard.response;

  try {
    const repair = await prisma.repairTicket.findUnique({
      where: { id: params.id },
      include: { customer: true, branch: true, technician: true, parts: { include: { product: true } } }
    });
    if (!repair) return NextResponse.json({ error: "Repair not found" }, { status: 404 });
    return NextResponse.json(repair);
  } catch (error) {
    return apiError(error);
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const guard = requirePermission("repairs:write");
  if (guard.response) return guard.response;

  try {
    const data = statusSchema.parse(await request.json());
    const repair = await prisma.repairTicket.update({
      where: { id: params.id },
      data: { ...data, warrantyUntil: data.warrantyUntil ? new Date(data.warrantyUntil) : undefined }
    });

    if (data.status === "COMPLETED") {
      await prisma.notification.create({
        data: {
          type: "COMPLETED_REPAIR",
          title: `${repair.ticketNumber} completed`,
          message: "Repair is ready for customer release.",
          branchId: repair.branchId
        }
      });
    }

    return NextResponse.json(repair);
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const guard = requirePermission("repairs:write");
  if (guard.response) return guard.response;

  try {
    await prisma.repairTicket.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}
