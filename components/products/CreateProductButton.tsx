'use client'

import { useRouter } from 'next/navigation';

export default function CreateProductButton() {
  const router = useRouter();

  return (
    <button
      className="bg-teal-400 hover:bg-teal-800 w-full lg:w-auto text-xl px-10 py-3 font-bold rounded text-center"
      onClick={() => router.push('/admin/products/new')}
    >
      Crear Producto
    </button>
  );
}
