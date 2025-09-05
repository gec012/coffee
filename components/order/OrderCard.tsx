"use client";

import { useState } from "react";
import { completeOrder } from "@/actions/complete-order-action";
import { markItemDispatched } from "@/actions/mark-item-dispatched";
import { formatCurrency } from "@/src/utils";
import { OrderWithProducts } from "@/src/types";
import { toast } from "react-toastify";
import { mutate } from "swr";
import { CldOgImage } from "next-cloudinary";

type OrderCardProps = {
  order: OrderWithProducts;
};

export default function OrderCard({ order }: OrderCardProps) {
  const isDelivery = !!order.deliveryAddress;
  const [loading, setLoading] = useState(false);

  // Inicializamos checkedItems desde la DB usando orderProducts.id
  const [checkedItems, setCheckedItems] = useState<number[]>(
    () => order.orderProducts.filter((p) => p.dispatched).map((p) => p.id)
  );

  const allChecked = checkedItems.length === order.orderProducts.length;

  const toggleItem = async (orderProductId: number) => {
    const isChecked = checkedItems.includes(orderProductId);

    try {
      // Actualiza el ítem en la DB
      await markItemDispatched(orderProductId, !isChecked);

      // Actualiza localmente
      setCheckedItems((prev) =>
        isChecked ? prev.filter((id) => id !== orderProductId) : [...prev, orderProductId]
      );

      // Refresca el listado completo para todos los usuarios
      mutate("/admin/orders/api");
    } catch   {
      toast.error("Error al actualizar el ítem");
    }
  };

  const handleComplete = async () => {
    if (!isDelivery && !allChecked) {
      toast.error("Tildá todos los productos antes de completar la orden");
      return;
    }

    setLoading(true);
    try {
      await completeOrder({ orderId: order.id, isDelivery });
      toast.success(
        isDelivery ? "Orden delivery lista para despachar" : "Orden completada"
      );
      mutate("/admin/orders/api");
    } catch {
      toast.error("Hubo un error al completar la orden");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white shadow-md border border-gray-300 rounded-lg p-4 w-full max-w-sm">
      {/* Cabecera */}
      <div className="flex justify-between items-center mb-2">
        <div>
          <p className="text-lg font-semibold text-gray-900">
            Cliente: {order.name || "Anónimo"}
          </p>

          <span className="text-xs bg-gray-200 text-gray-800 px-2 py-0.5 rounded">
            Orden #{order.id}
          </span>

          {order.tableId && (
            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
              Mesa {order.tableId}
            </span>
          )}

          {/* Badge de pago */}
          <span
            className={`ml-2 text-xs px-2 py-0.5 rounded ${
              order.paymentStatus === "pagado"
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {order.paymentStatus === "pagado" ? "Pagado" : "Pendiente de pago"}
          </span>

          {/* Badge de estado */}
          <span
            className={`ml-2 text-xs px-2 py-0.5 rounded ${
              order.status === "pendiente"
                ? "bg-gray-200 text-gray-800"
                : order.status === "en_preparacion"
                ? "bg-blue-100 text-blue-800"
                : order.status === "listo_para_entregar"
                ? "bg-orange-100 text-orange-800"
                : "bg-green-100 text-green-800" // entregado
            }`}
          >
            {order.status.replaceAll("_", " ")}
          </span>
        </div>

        <span
          className={`text-sm font-bold ${
            isDelivery ? "text-orange-600" : "text-green-600"
          }`}
        >
          {isDelivery ? "Delivery" : "Local"}
        </span>
      </div>

      {/* Productos */}
      <p className="text-sm font-medium text-gray-700 mb-2">Productos:</p>
      <div className="space-y-1">
        {order.orderProducts.map((product) => (
          <label
            key={product.id} // 👈 usar id de OrderProducts
            className="flex items-center justify-between gap-2 border-t border-gray-200 pt-1"
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={checkedItems.includes(product.id)}
                onChange={() => toggleItem(product.id)} // 👈 pasar id de OrderProducts
              />
              <span
                className={`text-sm ${
                  checkedItems.includes(product.id)
                    ? "line-through text-gray-400"
                    : "text-gray-900"
                }`}
              >
                {product.product.name} ({product.quantity})
              </span>
            </div>
            <span className="text-sm font-semibold text-gray-700">
              {formatCurrency(product.product.price * product.quantity)}
            </span>
          </label>
        ))}
      </div>

      {/* Total */}
      <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
        <p className="text-base font-medium text-gray-900">Total:</p>
        <p className="text-base font-medium text-gray-900">
          {formatCurrency(order.total)}
        </p>
      </div>

      {/* Botón de completar */}
      <button
        onClick={handleComplete}
        disabled={loading}
        className={`w-full mt-3 p-2 font-bold uppercase text-white ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-sky-600 hover:bg-sky-800"
        }`}
      >
        {loading
          ? "Procesando..."
          : isDelivery
          ? "Listo para despachar"
          : "Completar Orden"}
      </button>
    </section>
  );
}
