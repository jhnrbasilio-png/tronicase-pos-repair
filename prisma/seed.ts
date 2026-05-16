import { PrismaClient, RepairStatus, Role } from "@prisma/client";
import { branches, products, users } from "../src/lib/sample-data";

const prisma = new PrismaClient();
const passwordHash = "password123";

async function main() {
  await prisma.notification.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.repairPart.deleteMany();
  await prisma.repairTicket.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.saleItem.deleteMany();
  await prisma.sale.deleteMany();
  await prisma.stockTransfer.deleteMany();
  await prisma.stock.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
  await prisma.branch.deleteMany();

  const createdBranches = new Map<string, string>();
  for (const branch of branches) {
    const created = await prisma.branch.create({
      data: {
        slug: branch.id,
        name: branch.name,
        address: branch.address
      }
    });
    createdBranches.set(branch.id, created.id);
  }

  const createdUsers = new Map<string, string>();
  for (const user of users) {
    const created = await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        role: user.role as Role,
        passwordHash,
        branchId: user.branchId ? createdBranches.get(user.branchId) : undefined
      }
    });
    createdUsers.set(user.id, created.id);
  }

  for (const product of products) {
    const createdProduct = await prisma.product.create({
      data: {
        name: product.name,
        sku: product.sku,
        barcode: product.barcode,
        category: product.category,
        brand: product.brand,
        compatibility: product.compatibility,
        costPrice: product.costPrice,
        sellingPrice: product.sellingPrice,
        lowStockAlert: product.lowStock
      }
    });

    for (const branchId of createdBranches.values()) {
      await prisma.stock.create({
        data: {
          productId: createdProduct.id,
          branchId,
          quantity: product.stock
        }
      });
    }
  }

  const mainBranch = createdBranches.get("main")!;
  const cashier = createdUsers.get("u-cashier")!;
  const technician = createdUsers.get("u-tech")!;

  await prisma.sale.create({
    data: {
      receiptNumber: "TC-20260517-0001",
      type: "POS",
      branchId: mainBranch,
      cashierId: cashier,
      paymentMethod: "CASH",
      subtotal: 1840,
      discount: 150,
      total: 1690,
      amountTendered: 2000,
      items: {
        create: [
          {
            product: { connect: { sku: "TC-IP11-BAT" } },
            quantity: 1,
            unitPrice: 1690
          }
        ]
      }
    }
  });

  const customer = await prisma.customer.create({
    data: {
      name: "Jessa Agbayani",
      phone: "09171234567"
    }
  });

  await prisma.repairTicket.create({
    data: {
      ticketNumber: "R-1001",
      customerId: customer.id,
      branchId: mainBranch,
      technicianId: technician,
      deviceBrand: "Apple",
      deviceModel: "iPhone 11",
      problemDescription: "Fast battery drain and random shutdown",
      diagnosis: "Battery health failed load test",
      status: RepairStatus.IN_PROGRESS,
      laborFee: 700,
      partsTotal: 1690,
      warrantyUntil: new Date("2026-08-17")
    }
  });

  await prisma.expense.create({
    data: {
      category: "Rent",
      amount: 18000,
      branchId: mainBranch,
      recordedById: cashier,
      date: new Date("2026-05-15"),
      notes: "Monthly shop rent"
    }
  });

  await prisma.notification.createMany({
    data: [
      {
        type: "LOW_STOCK",
        title: "Galaxy A52 LCD Assembly below threshold",
        message: "Restock required for the main branch.",
        branchId: mainBranch
      },
      {
        type: "SUBSCRIPTION_REMINDER",
        title: "Subscription reminder",
        message: "System subscription renews soon."
      }
    ]
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
