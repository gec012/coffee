

import { Product } from "@prisma/client"
import { formatCurrency, getImagePath } from '../../src/utils/index';
import Image from "next/image";
import AddProductButton from "./AddProductButton";
import { products } from '../../prisma/data/products';

type ProductCardProps = {
    product:Product
}

export default function ProductCard({product}:ProductCardProps) {

  const imagePath = getImagePath(product.image)

  return (
    <div className="border bg-white rounded border-gray-200 shadow-lg ">

        <Image
         width={400}
         height={500}
         className="rounded"
         src={imagePath}
         alt={`Imagen platillo ${product.name}`}
         quality={50}
         priority
        />


       <div className="p-5">
            <h3 className=" text-2xl font-bold ">{product.name}</h3>
            <p className=" mt-5 font-black text-4xl text-teal-500">
            {formatCurrency(product.price)}
            </p>
           <AddProductButton
           product={product}
           />    
        </div> 
    </div>
  )
}
