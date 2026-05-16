import { NextResponse } from "next/server";
import { z } from "zod";
import { apiError, requirePermission } from "@/lib/api";
import { prisma } from "@/lib/db";

const notificationSchema = z.object({
  type: z.enum(["LOW_STOCK", "NEW_REPAIR", "COMPLETED_REPAIR", "SUBSCRIPTION_REMINDER", "BRANCH_ANNOUNCEMENT"]),
  title: z.string().min(1),
  message: z.string().min(1),
  branchId: z.string().optional(),
  userId: z.string().optional()
});

export async function GET() {
  const guard = requirePermission("notifications:read");
  if (guard.response) return guard.response;

  try {
    const notifications = await prisma.notification.findMany({
      include: { branch: true, user: true },
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(notifications);
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request) {
  const guard = requirePermission("notifications:write");
  if (guard.response) return guard.response;

  try {
    const body = notificationSchema.parse(await request.json());
    const notification = await prisma.notification.create({ data: body });
    return NextResponse.json(notification, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
