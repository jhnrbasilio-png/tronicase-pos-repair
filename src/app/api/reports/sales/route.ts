import { NextResponse } from "next/server";
import { apiError, requirePermission } from "@/lib/api";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const guard = requirePermission("reports:read");
  if (guard.response) return guard.response;
  const { searchParams } = new URL(request.url);
  const branchId = searchParams.get("branchId") || undefined;
  const cashierId = searchParams.get("cashierId") || undefined;
  const from = searchParams.get("from") ? new Date(searchParams.get("from")!) : undefined;
  const to = searchParams.get("to") ? new Date(searchParams.get("to")!) : undefined;

  try {
    const sales = await prisma.sale.findMany({
      where: { branchId, cashierId, createdAt: { gte: from, lte: to } },
      include: { branch: true, cashier: true }
    });
    const posSales = sales.filter((sale) => sale.type === "POS").reduce((sum, sale) => sum + Number(sale.total), 0);
    const repairSales = sales.filter((sale) => sale.type === "REPAIR").reduce((sum, sale) => sum + Number(sale.total), 0);
    return NextResponse.json({
      filters: { branchId, cashierId, from, to },
      posSales,
      repairSales,
      totalRevenue: posSales + repairSales,
      rows: sales
    });
  } catch (error) {
    return apiError(error);
  }
}
