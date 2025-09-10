"use server";

import { prisma } from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";

type CompleteOrderParams = {
  orderId: number;
  isDelivery: boolean;
};

export async function completeOrder({ orderId, isDelivery }: CompleteOrderParams) {
  try {
    await prisma.orderTable.update({
      where: { id: orderId },
      data: {
        status: isDelivery ? "listo_para_entregar" : "entregado",
      },
    });
    revalidatePath("/admin/orders");
  } catch (error) {
    console.log(error);
    throw new Error("Error al actualizar la orden");
  }
}
