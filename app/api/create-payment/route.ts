import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import QRCode from "qrcode";

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: "Falta orderId" }, { status: 400 });
    }

    // Buscamos la orden en la DB
    const order = await prisma.orderTable.findUnique({
      where: { id: Number(orderId) },
      include: { orderProducts: { include: { product: true } } },
    });

    if (!order) {
      return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
    }

    // 👉 Generamos un QR que apunta a la URL accesible desde tu celular
    // Cambiá 192.168.0.191 por la IP de tu PC en la red local
    const qrUrl = `http://192.168.0.191:3000/admin/orders/cobrar/${order.id}`;
    const qr_code_base64 = await QRCode.toDataURL(qrUrl);

    return NextResponse.json({
      id: order.id,
      status: order.paymentStatus,
      total: order.total,
      qr_code_base64,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error creando el pago" }, { status: 500 });
  }
}
