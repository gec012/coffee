import ProductTable from "@/components/products/ProductsTable";
import Heading from "@/components/ui/Heading";
import { prisma } from "@/src/lib/prisma";
import ProductSearchForm from "@/components/products/ProductSearchForm";
import { redirect } from "next/navigation";
import CreateProductButton from "@/components/products/CreateProductButton";
import ProductsPagination from "@/components/products/ProductsPagination";

async function productCount() {
  return prisma.product.count();
}

async function getProducts(page: number, pageSize: number) {
  const skip = (page - 1) * pageSize;
  return prisma.product.findMany({
    take: pageSize,
    skip,
    include: { category: true },
  });
}

export type ProductWithCategory = Array<{
  id: number;
  name: string;
  price: number;
  category: { id: number; name: string };
}>;

export default async function ProductsPage({ searchParams }: { searchParams: { page?: string } }) {
  const page = Math.max(1, +(searchParams.page || "1"));
  const pageSize = 10;

  const [products, totalProducts] = await Promise.all([getProducts(page, pageSize), productCount()]);

  const totalPages = Math.max(1, Math.ceil(totalProducts / pageSize));
  if (page > totalPages) redirect("/admin/products");

  return (
    <>
      <Heading>Administrar Productos</Heading>

      <div className="flex flex-col lg:flex-row lg:justify-between gap-5">
        <CreateProductButton />
        <ProductSearchForm />
      </div>

      <ProductTable products={products} />
      <ProductsPagination page={page} totalPages={totalPages} />
    </>
  );
}
