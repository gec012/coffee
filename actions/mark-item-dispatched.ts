"use server";

import { prisma } from "@/src/lib/prisma";

export async function markItemDispatched(orderProductId: number, dispatched: boolean) {
  return prisma.orderProducts.update({
    where: { id: orderProductId },
    data: { dispatched },
  });
}
