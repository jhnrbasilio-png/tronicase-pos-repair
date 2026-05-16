import { NextResponse } from "next/server";
import { z } from "zod";
import { apiError, requirePermission } from "@/lib/api";
import { prisma } from "@/lib/db";

const notificationUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  message: z.string().min(1).optional(),
  unread: z.boolean().optional()
});

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const guard = requirePermission("notifications:write");
  if (guard.response) return guard.response;

  try {
    const body = notificationUpdateSchema.parse(await request.json());
    const notification = await prisma.notification.update({ where: { id: params.id }, data: body });
    return NextResponse.json(notification);
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const guard = requirePermission("notifications:write");
  if (guard.response) return guard.response;

  try {
    await prisma.notification.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}
