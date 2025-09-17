'use client';
import { useEffect, useState } from "react";
import ImageUpload from "./ImageUpload";

type Category = { id: number; name: string };

interface Props {
  product?: { name?: string; price?: number; categoryId?: number; image?: string };
  onSubmit: (data: { name: string; price: number; categoryId: number; imageFile?: File }) => void;
}

export default function ProductForm({ product, onSubmit }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState(product?.name || "");
  const [price, setPrice] = useState(product?.price || 0);
  const [categoryId, setCategoryId] = useState(product?.categoryId || 0);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetch("/api/categories")
      .then(res => res.json())
      .then(data => setCategories(data));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !categoryId) return alert("Complete todos los campos");
    onSubmit({ name, price, categoryId, imageFile: imageFile || undefined });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Precio"
        value={price}
        onChange={e => setPrice(Number(e.target.value))}
      />
      <select value={categoryId} onChange={e => setCategoryId(Number(e.target.value))}>
        <option value={0}>Seleccione categoría</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>
      <ImageUpload image={product?.image} onChange={setImageFile} />
      <button type="submit">Guardar</button>
    </form>
  );
}
