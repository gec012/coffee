// /admin/orders/api
import { prisma } from "@/src/lib/prisma";

export async function GET() {
  const orders = await prisma.order.findMany({
    where: {
      status: {
        in: ["en_preparacion", "listo_para_entregar"], // 👈 ahora trae las activas
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
