// app/admin/orders/getOrders.ts
import { prisma } from "@/src/lib/prisma";

export async function getOrders() {
  return prisma.orderTable.findMany({
    include: {
      orderProducts: {
        include: { product: true },
      },
    },
  });
}
