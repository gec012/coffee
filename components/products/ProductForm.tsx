'use client';
import { useEffect, useState } from "react";
import ImageUpload from "./ImageUpload";

type Category = {
  id: string;
  name: string;
};

type ProductFormProps = {
  product?: {
    name?: string;
    price?: number;
    categoryId?: string;
    image?: string;
  };
};

export default function ProductForm({ product }: ProductFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then(res => res.json())
      .then(data => setCategories(data));
  }, []);

  return (
    <>
      <div className="space-y-2">
        <label htmlFor="name" className="text-slate-800">Nombre:</label>
        <input
          id="name"
          name="name"
          type="text"
          defaultValue={product?.name}
          placeholder="Nombre Producto"
          className="block w-full p-3 bg-slate-100 border border-gray-300 rounded"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="price" className="text-slate-800">Precio:</label>
        <input
          id="price"
          name="price"
          type="number"
          step="0.01"
          defaultValue={product?.price}
          placeholder="Precio Producto"
          className="block w-full p-3 bg-slate-100 border border-gray-300 rounded"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="categoryId" className="text-slate-800">Categoría:</label>
        <select
          id="categoryId"
          name="categoryId"
          defaultValue={product?.categoryId}
          className="block w-full p-3 bg-slate-200 border border-gray-300 rounded"
        >
          <option value="">-- Seleccione --</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <ImageUpload image={product?.image} />
    </>
  );
}
