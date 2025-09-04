import { Product } from "@prisma/client";
import { formatCurrency, getImagePath } from "@/src/utils";
import Image from "next/image";
import AddProductButton from "./AddProductButton";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const imagePath = getImagePath(product.image);

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-150 overflow-hidden flex flex-col">
      {/* Imagen pequeña */}
      <div className="relative w-full h-36">
        <Image
          src={imagePath}
          alt={product.name}
          fill
          className="object-cover"
          quality={60}
          priority
        />
      </div>

      <div className="p-3 flex flex-col justify-between flex-1">
        <h3 className="text-sm font-semibold line-clamp-2">{product.name}</h3>
        <p className="text-teal-500 font-bold text-sm mt-1">
          {formatCurrency(product.price)}
        </p>
        <div className="mt-2">
          <AddProductButton product={product} />
        </div>
      </div>
    </div>
  );
}

