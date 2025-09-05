// OrderSummary.tsx
'use client';

import { useMemo, useState } from "react";
import { useStore } from "@/src/store";
import ProductDetails from "./ProductDetails";
import { formatCurrency } from "@/src/utils";
import { createOrder } from "@/actions/create-order-action";
import { OrderSchema } from "@/src/schema";
import { toast } from "react-toastify";

type Props = {
  role: "client" | "waiter" | "admin";
  tableId?: string;
};

export default function OrderSummary({ role, tableId }: Props) {
  const order = useStore((state) => state.order);
  const clearOrder = useStore((state) => state.clearOrder);
  const total = useMemo(
    () => order.reduce((sum, i) => sum + i.quantity * i.price, 0),
    [order]
  );
  const [loading, setLoading] = useState(false);

  const handleCreateOrder = async (formData: FormData) => {
    setLoading(true);

    const data = {
      name: formData.get("name")?.toString() || undefined,
      total,
      orderProducts: order.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
      tableId: tableId || formData.get("table")?.toString() || undefined,
    };

    const result = OrderSchema.safeParse(data);
    if (!result.success) {
      result.error.issues.forEach((i) => toast.error(i.message));
      setLoading(false);
      return;
    }

    const response = await createOrder(result.data);
    if (response?.errors) {
      response.errors.forEach((i) => toast.error(i.message));
      setLoading(false);
      return;
    }

    toast.success("Pedido realizado correctamente");
    clearOrder();
    setLoading(false);
  };


  return (
    <aside className="bg-white shadow-md border border-gray-200 rounded-t-lg md:rounded-none md:h-full overflow-y-auto p-3">
      <h2 className="text-lg font-bold text-center mb-3">Mi Pedido</h2>

      {order.length === 0 ? (
        <div className="text-center text-gray-500 mt-5">
          <p>El carrito está vacío</p>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-gray-200">
          {order.map((item) => (
            <ProductDetails key={item.id} item={item} />
          ))}

          <div className="mt-2 flex justify-between font-bold text-gray-800">
            <span>Total:</span>
            <span className="text-green-600">{formatCurrency(total)}</span>
          </div>

          
            <form
              className="mt-3 flex flex-col gap-2"
              onSubmit={async (e) => {
                e.preventDefault();
                await handleCreateOrder(new FormData(e.currentTarget));
              }}
            >
              {/* Mozo y Admin pueden cargar mesa */}
              {((role === "waiter" || role === "admin") && !tableId) && (
                <input
                  type="text"
                  name="table"
                  placeholder="Número de mesa"
                  required={role === "waiter"}  // 👈 obligatorio solo para mozo
                  className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              )}



              {/* Cliente y Admin pueden cargar nombre */}
              {((role === "client" || role === "admin")) && (
                <input
                  type="text"
                  name="name"
                  placeholder="Nombre del cliente (opcional)"
                  className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              )}



              <button
                type="submit"
                disabled={loading}
                className={`p-2 rounded font-bold text-white ${loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-sky-600 hover:bg-sky-700"
                  }`}
              >
                {loading ? "Procesando..." : "Confirmar Pedido"}
              </button>
            </form>

          
        </div>
      )}
    </aside>
  );
}
