'use client';
import AddProductForm from "@/components/products/AddProductForm";
import ProductForm from "@/components/products/ProductForm";
import Heading from "@/components/ui/Heading";

export default function CreateProductPage() {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <Heading>Nuevo Producto</Heading>
      <AddProductForm>
        <ProductForm onSubmit={() => {}} />
      </AddProductForm>
    </div>
  );
}
