import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function POST(req: Request) {
  try {
    const { name, price, categoryId, image } = await req.json();

    if (!name || !price || !categoryId) {
      return NextResponse.json({ error: "Faltan campos" }, { status: 400 });
    }

    const categoryIdNum = Number(categoryId);
    if (isNaN(categoryIdNum)) {
      return NextResponse.json({ error: "categoryId inválido" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name,
        price,
        categoryId: categoryIdNum,
        image: image || "",
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al crear producto" }, { status: 500 });
  }
}
