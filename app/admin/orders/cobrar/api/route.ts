// /app/admin/orders/cobrar/api/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function GET() {
  try {
    // Traer todas las órdenes pendientes con sus productos
    const pendingOrders = await prisma.orderTable.findMany({
      where: { paymentStatus: "pendiente" },
      include: {
        orderProducts: { include: { product: true } },
      },
      orderBy: [
        { tableId: "asc" },
        { createdAt: "asc" },
      ],
    });

    // Agrupar por mesa y calcular total en un solo paso
    const tablesMap = pendingOrders.reduce<Record<string, { orders: typeof pendingOrders[0][]; total: number }>>(
      (acc, order) => {
        const table = order.tableId || "Sin mesa";
        if (!acc[table]) acc[table] = { orders: [], total: 0 };
        acc[table].orders.push(order);
        acc[table].total += Number(order.total); // ✅ convertir Decimal o number a número
        return acc;
      },
      {}
    );

    // Transformar el objeto en array para la respuesta
    const result = Object.entries(tablesMap).map(([tableId, data]) => ({
      tableId,
      orders: data.orders,
      total: data.total,
    }));

    return NextResponse.json(result);
  } catch (err) {
    console.error("Error fetching pending orders:", err);
    return NextResponse.json({ error: "Error al cargar órdenes" }, { status: 500 });
  }
}


export async function POST(req: Request) {
  try {
    const { tableId } = await req.json();
    if (!tableId) throw new Error("Falta tableId");

    await prisma.orderTable.updateMany({
      where: { tableId, paymentStatus: "pendiente" },
      data: { paymentStatus: "pagado" },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error al cobrar mesa" }, { status: 500 });
  }
}

