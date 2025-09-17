'use client'

import { useRouter } from 'next/navigation';

interface Props {
  page: number;
  totalPages: number;
}

export default function ProductsPagination({ page, totalPages }: Props) {
  const router = useRouter();

  const goToPage = (newPage: number) => {
    router.push(`/admin/products?page=${newPage}`);
  };

  return (
    <div className="flex gap-2 mt-4">
      <button
        disabled={page === 1}
        onClick={() => goToPage(page - 1)}
        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
      >
        Anterior
      </button>

      <span className="px-4 py-2">{page} / {totalPages}</span>

      <button
        disabled={page === totalPages}
        onClick={() => goToPage(page + 1)}
        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
      >
        Siguiente
      </button>
    </div>
  );
}
