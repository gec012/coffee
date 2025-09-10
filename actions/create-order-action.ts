"use server";

import { prisma } from "@/src/lib/prisma";
import { OrderSchema } from "@/src/schema";

export async function createOrder(data: unknown) {
  // Validación con Zod
  const result = OrderSchema.safeParse(data);

  if (!result.success) {
    return { errors: result.error.issues };
  }

  try {
    // Asegurarse de que orderProducts sea un array válido
    const orderProductsData = Array.isArray(result.data.orderProducts)
      ? result.data.orderProducts.map((p) => ({
          productId: p.productId,
          quantity: p.quantity,
        }))
      : [];

    await prisma.orderTable.create({
      data: {
        name: result.data.name || null,
        total: result.data.total,
        tableId: result.data.tableId || null,
        userId: result.data.userId || null,
        status: "pendiente",
        paymentStatus: "pendiente",
        paymentMethod: result.data.paymentMethod || null,
        deliveryAddress: result.data.deliveryAddress || null,
        deliveryComment: result.data.deliveryComment || null,
        ticketGenerated: false,
        orderProducts: {
          create: orderProductsData,
        },
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error al crear la orden en el servidor:", error);
    return { errors: [{ message: "Error al crear la orden en el servidor" }] };
  }
}
