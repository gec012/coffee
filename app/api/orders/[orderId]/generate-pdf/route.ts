import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import QRCode from "qrcode";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function GET(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params;

    // Buscar la orden en la DB
    const order = await prisma.orderTable.findUnique({
      where: { id: Number(orderId) },
      include: { orderProducts: { include: { product: true } } },
    });

    if (!order) {
      return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
    }

    if (order.paymentStatus !== "pagado") {
      return NextResponse.json({ error: "La orden no está pagada" }, { status: 400 });
    }

    // Crear PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([400, 600]);
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    page.drawText(`Orden ID: ${order.id}`, { x: 50, y: height - 50, font, size: 14 });
    page.drawText(`Fecha: ${order.date.toLocaleString()}`, { x: 50, y: height - 70, font, size: 12 });
    page.drawText(`Total: $${order.total}`, { x: 50, y: height - 90, font, size: 12 });
    page.drawText(`Estado del pago: ${order.paymentStatus}`, { x: 50, y: height - 110, font, size: 12 });

    page.drawText("Productos:", { x: 50, y: height - 140, font, size: 12 });
    let y = height - 160;
    order.orderProducts.forEach(op => {
      page.drawText(`${op.quantity}x ${op.product.name} - $${op.product.price}`, { x: 60, y, font, size: 12 });
      y -= 20;
    });

    // Generar QR apuntando a la URL de la orden
    const qrUrl = `http://192.168.0.191:3000/admin/orders/cobrar/${order.id}`; // reemplaza con tu IP
    const qrDataUrl = await QRCode.toDataURL(qrUrl);
    const base64Data = qrDataUrl.split(",")[1];
    const qrImageBytes = new Uint8Array(Buffer.from(base64Data, "base64"));

    const qrImage = await pdfDoc.embedPng(qrImageBytes);
    const qrDims = qrImage.scale(1.5);
    page.drawImage(qrImage, { x: width - qrDims.width - 50, y: 50, width: qrDims.width, height: qrDims.height });

    // Guardar PDF como Uint8Array normal
    const pdfBytes = await pdfDoc.save();
    const pdfBuffer = new Uint8Array(pdfBytes);

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=orden_${order.id}.pdf`,
      },
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error generando PDF" }, { status: 500 });
  }
}
