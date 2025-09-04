'use client';

import { XCircleIcon, MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { OrderItem } from "@/src/store";
import { formatCurrency } from "@/src/utils";
import { useStore } from "@/src/store";

type Props = {
  item: OrderItem;
};

export default function ProductDetails({ item }: Props) {
  const increaseQuantity = useStore((state) => state.increaseQuantity);
  const decreaseQuantity = useStore((state) => state.decreaseQuantity);
  const removeItem = useStore((state) => state.removeItem);

  return (
    <div className="flex items-center justify-between p-2 border-b border-gray-200">
      {/* Nombre y subtotal */}
      <div className="flex-1 flex flex-col">
        <span className="text-sm font-semibold">{item.name}</span>
        <span className="text-xs text-gray-600">
          {formatCurrency(item.price * item.quantity)}
        </span>
      </div>

      {/* Controles de cantidad */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => decreaseQuantity(item.id)}
          className="disabled:opacity-30 p-1"
          disabled={item.quantity <= 1}
        >
          <MinusIcon className="h-4 w-4" />
        </button>

        <span className="text-sm font-bold w-5 text-center">{item.quantity}</span>

        <button
          onClick={() => increaseQuantity(item.id)}
          className="disabled:opacity-30 p-1"
        >
          <PlusIcon className="h-4 w-4" />
        </button>
      </div>

      {/* Botón eliminar */}
      <button
        onClick={() => removeItem(item.id)}
        className="text-red-600 p-1"
      >
        <XCircleIcon className="h-5 w-5" />
      </button>
    </div>
  );
}
