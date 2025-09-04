"use client";

import { Product } from "@prisma/client";
import { useStore } from "@/src/store";

type AddProductButtonProps = {
  product: Product;
};

export default function AddProductButton({ product }: AddProductButtonProps) {
  const addToOrder = useStore((state) => state.addToOrder);

  return (
    <button
      type="button"
      onClick={() => addToOrder(product)}
      className="bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm py-2 px-3 rounded-lg transition-colors w-full"
    >
      Agregar
    </button>
  );
}


