import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: "Falta orderId" }, { status: 400 });
    }

    // Actualizamos la orden simulando el pago
    const updatedOrder = await prisma.orderTable.update({
      where: { id: Number(orderId) },
      data: { paymentStatus: "pagado", paymentMethod: "qr_simulado" },
    });

    return NextResponse.json({
      id: updatedOrder.id,
      status: updatedOrder.paymentStatus,
      total: updatedOrder.total,
      message: "Pago simulado con éxito",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al pagar la orden" }, { status: 500 });
  }
}
