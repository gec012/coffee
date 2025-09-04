import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const categories = await prisma.category.findMany({
    select: { id: true, name: true ,slug:true} // campos necesarios
  });
  return NextResponse.json(categories);
}
