import AddProductForm from "@/components/products/AddProductForm";
import ProductForm from "@/components/products/ProductForm";
import Heading from "@/components/ui/Heading";


export default async function CreateProductPage() {
  const product = null; // o cargar producto existente
  return (
    <>
      <Heading>Nuevo Producto</Heading>
      <AddProductForm>
        <ProductForm/>
      </AddProductForm>
    </>
  )
}

