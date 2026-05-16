import { NextResponse } from "next/server";
import { z } from "zod";
import { apiError, requirePermission } from "@/lib/api";
import { prisma } from "@/lib/db";

const repairSchema = z.object({
  customer: z.object({
    name: z.string().min(1),
    phone: z.string().optional(),
    email: z.string().optional(),
    address: z.string().optional()
  }),
  branchId: z.string().min(1),
  technicianId: z.string().optional(),
  deviceBrand: z.string().min(1),
  deviceModel: z.string().min(1),
  problemDescription: z.string().min(1),
  diagnosis: z.string().optional(),
  status: z
    .enum(["PENDING", "DIAGNOSING", "WAITING_PARTS", "IN_PROGRESS", "COMPLETED", "RELEASED", "CANCELLED"])
    .default("PENDING"),
  laborFee: z.coerce.number().min(0).default(0),
  customerSignature: z.string().optional(),
  beforePhotoUrl: z.string().optional(),
  afterPhotoUrl: z.string().optional(),
  warrantyUntil: z.string().optional(),
  parts: z.array(z.object({ productId: z.string(), quantity: z.coerce.number().int().min(1), unitPrice: z.coerce.number().min(0) })).default([])
});

export async function GET(request: Request) {
  const guard = requirePermission("repairs:write");
  if (guard.response) return guard.response;
  const { searchParams } = new URL(request.url);
  const branchId = searchParams.get("branchId") || undefined;

  try {
    const repairs = await prisma.repairTicket.findMany({
      where: { branchId },
      include: { customer: true, branch: true, technician: true, parts: { include: { product: true } } },
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(repairs);
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request) {
  const guard = requirePermission("repairs:create");
  if (guard.response) return guard.response;

  try {
    const body = repairSchema.parse(await request.json());
    const partsTotal = body.parts.reduce((sum, part) => sum + part.quantity * part.unitPrice, 0);
    const repair = await prisma.$transaction(async (tx) => {
      const customer = await tx.customer.create({ data: body.customer });
      const ticket = await tx.repairTicket.create({
        data: {
          ticketNumber: `R-${Date.now().toString().slice(-6)}`,
          customerId: customer.id,
          branchId: body.branchId,
          technicianId: body.technicianId,
          deviceBrand: body.deviceBrand,
          deviceModel: body.deviceModel,
          problemDescription: body.problemDescription,
          diagnosis: body.diagnosis,
          status: body.status,
          laborFee: body.laborFee,
          partsTotal,
          customerSignature: body.customerSignature,
          beforePhotoUrl: body.beforePhotoUrl,
          afterPhotoUrl: body.afterPhotoUrl,
          warrantyUntil: body.warrantyUntil ? new Date(body.warrantyUntil) : undefined,
          parts: {
            create: body.parts.map((part) => ({
              productId: part.productId,
              quantity: part.quantity,
              unitPrice: part.unitPrice
            }))
          }
        },
        include: { customer: true, parts: true }
      });

      for (const part of body.parts) {
        await tx.stock.update({
          where: { productId_branchId: { productId: part.productId, branchId: body.branchId } },
          data: { quantity: { decrement: part.quantity } }
        });
      }

      await tx.notification.create({
        data: {
          type: "NEW_REPAIR",
          title: `New repair ${ticket.ticketNumber}`,
          message: `${body.deviceBrand} ${body.deviceModel} received for repair.`,
          branchId: body.branchId
        }
      });

      return ticket;
    });
    return NextResponse.json(repair, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
