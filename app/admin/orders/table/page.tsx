"use client";

import { useEffect, useState } from "react";

interface OrderProduct {
  name: string;
  quantity: number;
}

interface Order {
  id: number;
  client: string;
  total: number;
  date: string;
  status: string;
  paymentStatus: string;
  orderProducts?: OrderProduct[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  useEffect(() => {
    fetch("/admin/orders/table/api")
      .then((res) => res.json())
      .then((data: Order[]) => setOrders(data))
      .catch(console.error);
  }, []);

  const toggleRow = (id: number) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const filteredOrders = orders.filter((o) => {
    const searchLower = search.toLowerCase();
    const productsText = o.orderProducts?.map((p) => p.name).join(" ") ?? "";

    const matchesSearch =
      o.id.toString().includes(searchLower) ||
      o.client.toLowerCase().includes(searchLower) ||
      productsText.toLowerCase().includes(searchLower);

    const matchesPayment =
      paymentFilter === "all" || o.paymentStatus === paymentFilter;

    const matchesStatus = statusFilter === "all" || o.status === statusFilter;

    const orderDate = new Date(o.date);
    const matchesDate =
      (!dateFrom || orderDate >= new Date(dateFrom)) &&
      (!dateTo || orderDate <= new Date(dateTo));

    return matchesSearch && matchesPayment && matchesStatus && matchesDate;
  });

  return (
    <div className="p-6 font-sans">
      <h2 className="text-2xl font-bold mb-4">Órdenes</h2>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Buscar por ID, cliente o producto"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded-md flex-1 min-w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Todos los pagos</option>
          <option value="pendiente">Pendiente</option>
          <option value="pagado">Pagado</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="en_preparacion">En preparación</option>
          <option value="listo_para_entregar">Listo para entregar</option>
          <option value="entregado">Entregado</option>
        </select>
        <div className="flex gap-2 items-center">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span>-</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[800px] w-full border border-blue-600 shadow-lg">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-3 text-left border-b border-blue-400">ID</th>
              <th className="p-3 text-left border-b border-blue-400">Cliente</th>
              <th className="p-3 text-left border-b border-blue-400">Total</th>
              <th className="p-3 text-left border-b border-blue-400">Estado</th>
              <th className="p-3 text-left border-b border-blue-400">Pago</th>
              <th className="p-3 text-left border-b border-blue-400">Productos</th>
              <th className="p-3 text-left border-b border-blue-400">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-4 text-center">
                  No hay órdenes
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => {
                const isExpanded = expandedRows.includes(order.id);
                const products = order.orderProducts ?? [];
                const firstTwo = products.slice(0, 2);
                return (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <td className="p-2 border-b">{order.id}</td>
                    <td className="p-2 border-b">{order.client}</td>
                    <td className="p-2 border-b">${order.total.toFixed(2)}</td>
                    <td className={`p-2 border-b ${statusColor(order.status)}`}>
                      {order.status}
                    </td>
                    <td className={`p-2 border-b ${paymentColor(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </td>
                    <td
                      className="p-2 border-b"
                      onClick={() => products.length > 2 && toggleRow(order.id)}
                      title={products.map((p) => `${p.name} x${p.quantity}`).join(", ")}
                    >
                      {isExpanded
                        ? products.map((p) => `${p.name} x${p.quantity}`).join(", ")
                        : firstTwo
                            .map((p) => `${p.name} x${p.quantity}`)
                            .join(", ") + (products.length > 2 ? ` +${products.length - 2} más` : "")}
                    </td>
                    <td className="p-2 border-b">
                      {order.date ? new Date(order.date).toLocaleString() : "—"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Colores para estado de orden
const statusColor = (status: string) => {
  switch (status) {
    case "pendiente":
      return "bg-yellow-100 text-yellow-800";
    case "en_preparacion":
      return "bg-orange-100 text-orange-800";
    case "listo_para_entregar":
      return "bg-blue-100 text-blue-800";
    case "entregado":
      return "bg-green-100 text-green-800";
    default:
      return "";
  }
};

// Colores para estado de pago
const paymentColor = (status: string) => {
  switch (status) {
    case "pendiente":
      return "bg-red-100 text-red-800";
    case "pagado":
      return "bg-green-100 text-green-800";
    default:
      return "";
  }
};
