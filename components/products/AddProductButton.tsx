
"use client"

import { Product } from "@prisma/client"
import {useStore} from "@/src/store"

type AddProductButtonProps = {
    product:Product
}

export default function AddProductButton({product}:AddProductButtonProps) {

    const addToOrder = useStore((state)=>state.addToOdder)

  return (
    <button
    type="button"
    className="bg-sky-600 hover:bg-sky-800 text-white w-full mt-5 p-3 uppercase font-bold cursor-pointer rounded"
    onClick={() => addToOrder(product)}
    >
    Agregar
    </button>    
  )
}
