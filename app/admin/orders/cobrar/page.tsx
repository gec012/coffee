"use client";

import { useEffect, useState } from "react";
import SearchBar from "@/components/order/cobro/SearchBar"; // ajustá la ruta según tu proyecto

type Product = {
  id: string;
  name: string;
  price: number;
};

type OrderProduct = {
  product: Product;
  quantity: number;
};

type Order = {
  id: string;
  total: number;
  createdAt: string;
  orderProducts: OrderProduct[];
};

type Table = {
  tableId: string;
  orders: Order[];
  total: number;
};

// Función para resaltar solo el número de la mesa si coincide exactamente
function highlightTableId(tableId: string, query: string) {
  if (!query) return tableId;

  // Buscar solo coincidencia exacta de número al final o separada por espacio
  const regex = new RegExp(`\\b${query}\\b`, "gi");
  const parts = tableId.split(regex);

  if (parts.length === 1) return tableId; // no hay coincidencia

  return parts.reduce((acc: React.ReactNode[], part, index) => {
    acc.push(part);
    if (index < parts.length - 1) {
      acc.push(
        <span key={index} className="bg-yellow-200 font-semibold">
          {query}
        </span>
      );
    }
    return acc;
  }, []);
}

export default function CobrarPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [search, setSearch] = useState(""); // estado del buscador

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/admin/orders/cobrar/api");
      const data = await res.json();
      setTables(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCobrar = async (tableId: string) => {
    setProcessing(tableId);
    try {
      const res = await fetch(`/admin/orders/cobrar/api`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tableId }),
      });
      if (res.ok) await fetchOrders();
      else console.error("Error al cobrar la mesa");
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(null);
    }
  };

  // Filtrado solo por coincidencia exacta de número de mesa
  const filteredTables = search
    ? tables.filter(table => new RegExp(`\\b${search}\\b`).test(table.tableId))
    : tables;

  if (loading) return <div className="p-4">Cargando órdenes...</div>;
  if (tables.length === 0) return <div className="p-4">No hay órdenes pendientes.</div>;

  return (
    <div className="p-6">
      <SearchBar value={search} onChange={setSearch} />

      {filteredTables.length === 0 ? (
        <div>No se encontraron mesas.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTables.map(table => (
            <div
              key={table.tableId}
              className="border rounded-lg p-4 shadow-md bg-white flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  Mesa: {highlightTableId(table.tableId, search)} - Total: ${table.total.toFixed(2)}
                </h2>
                <div className="space-y-3">
                  {table.orders.map(order => (
                    <div key={order.id} className="border-t pt-2">
                      <div className="text-sm text-gray-500 mb-1">Orden ID: {order.id}</div>
                      <ul className="list-disc list-inside text-gray-700">
                        {order.orderProducts.map(op => (
                          <li key={op.product.id}>
                            {op.product.name} x {op.quantity} - ${op.product.price.toFixed(2)}
                          </li>
                        ))}
                      </ul>
                      <div className="text-right font-semibold mt-1">
                        Total Orden: ${order.total.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleCobrar(table.tableId)}
                disabled={processing === table.tableId}
                className={`mt-4 px-4 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700 transition ${
                  processing === table.tableId ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {processing === table.tableId ? "Procesando..." : "Cobrar"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
