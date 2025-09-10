// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import { categories } from "./data/categories";
import { products } from "./data/products";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Sembrando categorías...");
  for (const category of categories) {
    await prisma.category.create({
      data: category,
    });
  }

  console.log("🌱 Sembrando productos...");
  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log("✅ Seed completado");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error en seed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
