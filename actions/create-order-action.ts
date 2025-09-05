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
    await prisma.order.create({
      data: {
        name: result.data.name,
        total: result.data.total,
        tableId: result.data.tableId,
        userId: result.data.userId,
        status: "en_preparacion", // ✅ orden creada en preparación
        orderProducts: {
          create: result.data.orderProducts.map((p) => ({
            productId: p.productId,
            quantity: p.quantity,
          })),
        },
      },
    });

    return { success: true };
  } catch (error) {
    console.log(error);
    return { errors: [{ message: "Error al crear la orden en el servidor" }] };
  }
}
