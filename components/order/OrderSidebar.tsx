'use client';
import { useState, useEffect } from "react";
import Logo from "../ui/Logo";
import CategoryIcon from "../ui/CategoryIcon";

type Category = {
  id: number;
  name: string;
  slug: string;
};

type Props = {
  isOpen: boolean;
  onSelectCategory?: () => void;
}

export default function OrderSidebar({ isOpen, onSelectCategory }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data || []));
  }, []);

  return (
    <>
      {/* Overlay móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={onSelectCategory} // cierra el sidebar
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static top-0 left-0 z-50 h-screen w-64 bg-slate-100 flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        `}
      >
        <Logo />

        {/* Categorías */}
        <nav className="flex-1 overflow-y-auto mt-4 px-2">
          {categories.length === 0 ? (
            <p className="px-4 py-2 text-gray-500">Cargando categorías...</p>
          ) : (
            categories.map((category) => (
              <CategoryIcon
                key={category.id}
                category={category}
                iconSize="w-8 h-8"
                textSize="text-sm font-semibold"
                onClick={onSelectCategory} // cierra el sidebar al seleccionar
              />
            ))
          )}
        </nav>
      </aside>
    </>
  );
}
