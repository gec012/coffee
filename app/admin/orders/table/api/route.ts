// app/admin/orders/table/api/route.ts
import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const orders = await prisma.orderTable.findMany({
      include: {
        user: true, // 👈 traemos el usuario
        orderProducts: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = orders.map((order) => ({
      id: order.id,
      client: order.user?.name ?? order.name ?? "Cliente anónimo",
      total: Number(order.total.toFixed(2)),
      date: order.date.toISOString(),
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      orderProducts: order.orderProducts.map((op) => ({
        name: op.product.name,
        quantity: op.quantity,
      })),
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Error al obtener orders:", error);
    return NextResponse.json({ error: "Error al obtener orders" }, { status: 500 });
  }
}
