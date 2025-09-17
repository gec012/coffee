'use client';
import Link from "next/link";
import { useParams } from "next/navigation";

type SimpleCategory = {
  id: number;
  name: string;
  slug: string;
};

type CategoryIconProps = {
  category: SimpleCategory;
  onClick?: () => void;
  textSize?: string;
  className?: string;
  iconSize?: string;
};

export default function CategoryIcon({
  category,
  onClick,
  textSize = 'text-base font-medium',
  className = '',
  iconSize = 'w-5 h-5'
}: CategoryIconProps) {
  const params = useParams<{ category: string }>();
  const isActive = category.slug === params.category;

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-4 cursor-pointer border-t border-gray-200 p-3 last-of-type:border-b hover:bg-sky-100 ${
        isActive ? 'bg-teal-200' : ''
      } ${className}`}
    >
      {/* Circulito indicador táctil */}
      <div
        className={`rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${iconSize} ${
          isActive ? "bg-sky-500 border-sky-500" : "border-sky-500"
        }`}
      />

      <Link href={`/order/${category.slug}`} className={textSize}>
        {category.name}
      </Link>
    </div>
  );
}
