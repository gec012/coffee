'use client'
import { Category } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

type CategoryIconProps = {
  category: Category;
  onClick?: () => void;
  iconSize?: string; // Tailwind clases para tamaño del icono
  textSize?: string; // Tailwind clases para tamaño del texto
  className?: string;
};

export default function CategoryIcon({
  category,
  onClick,
  iconSize = 'w-8 h-8', // tamaño por defecto
  textSize = 'text-base font-medium', // tamaño por defecto
  className = '',
}: CategoryIconProps) {
  const params = useParams<{ category: string }>();

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 cursor-pointer border-t border-gray-200 p-2 last-of-type:border-b hover:bg-sky-100 ${
        category.slug === params.category ? 'bg-teal-200' : ''
      } ${className}`}
    >
      <div className={`relative ${iconSize}`}>
        <Image
          fill
          src={`/icon_${category.slug}.svg`}
          alt={`Icono de ${category.name}`}
        />
      </div>

      <Link
        href={`/order/${category.slug}`}
        className={textSize}
      >
        {category.name}
      </Link>
    </div>
  );
}
