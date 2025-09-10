// /admin/orders/api
import { prisma } from "@/src/lib/prisma";

export async function GET() {
  const orders = await prisma.orderTable.findMany({
    where: {
      status: {
        in: ["en_preparacion", "listo_para_entregar", "pendiente"], // 👈 trae las activas
      },
    },
    include: {
      orderProducts: {
        include: { product: true },
      },
    },
  });

  return Response.json(orders);
}
