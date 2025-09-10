"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

type Order = {
  id: number;
  client: string;
  total: number;
  date: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  orderProducts: { name: string; quantity: number }[];
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // filtros
  const [search, setSearch] = useState("");
  const [filterPayment, setFilterPayment] = useState<"" | "paid" | "pending">("");
  const [filterStatus, setFilterStatus] = useState<"" | string>("");
  const [fechaDesde, setFechaDesde] = useState<string>("");
  const [fechaHasta, setFechaHasta] = useState<string>("");

  const [sortBy, setSortBy] = useState<keyof Order | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const [page, setPage] = useState(1);
  const perPage = 10;

  // productos expandibles
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const toggleRow = (id: number) => {
    const newSet = new Set(expandedRows);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedRows(newSet);
  };

  // fetch orders
  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/admin/orders/table/api", { cache: "no-store" });
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  // filtros, búsqueda y ordenamiento
  useEffect(() => {
    let data = [...orders];

    // búsqueda cliente o producto
    if (search) {
      data = data.filter(
        (order) =>
          order.client.toLowerCase().includes(search.toLowerCase()) ||
          order.orderProducts.some((p) =>
            p.name.toLowerCase().includes(search.toLowerCase())
          )
      );
    }

    // filtro pago
    if (filterPayment) {
      data = data.filter(
        (order) => order.paymentStatus.toLowerCase() === filterPayment
      );
    }

    // filtro estado
    if (filterStatus) {
      data = data.filter(
        (order) => order.status.toLowerCase() === filterStatus.toLowerCase()
      );
    }

    // filtro por rango de fecha
    if (fechaDesde) {
      data = data.filter((order) => new Date(order.date) >= new Date(fechaDesde));
    }
    if (fechaHasta) {
      data = data.filter((order) => new Date(order.date) <= new Date(fechaHasta));
    }

    // ordenamiento
    if (sortBy) {
      data.sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortDir === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortDir === "asc" ? aValue - bValue : bValue - aValue;
        }
        return 0;
      });
    }

    setFilteredOrders(data);
    setPage(1);
  }, [orders, search, filterPayment, filterStatus, fechaDesde, fechaHasta, sortBy, sortDir]);

  const handleSort = (column: keyof Order) => {
    if (sortBy === column) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else {
      setSortBy(column);
      setSortDir("asc");
    }
  };

  const totalPages = Math.ceil(filteredOrders.length / perPage);
  const paginatedOrders = filteredOrders.slice(
    (page - 1) * perPage,
    page * perPage
  );

  if (loading) return <div className="p-4">Cargando órdenes...</div>;

  const allStatuses = Array.from(new Set(orders.map((o) => o.status)));

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Órdenes</h1>

      {/* filtros */}
      <div className="mb-6 flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="Buscar por cliente o producto"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-60"
        />

        <select
          value={filterPayment}
          onChange={(e) => setFilterPayment(e.target.value as any)}
          className="border p-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos los pagos</option>
          <option value="paid">Pagado</option>
          <option value="pending">Pendiente</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border p-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos los estados</option>
          {allStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={fechaDesde}
          onChange={(e) => setFechaDesde(e.target.value)}
          className="border p-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="date"
          value={fechaHasta}
          onChange={(e) => setFechaHasta(e.target.value)}
          className="border p-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={() => handleSort("total")}
          className="bg-blue-500 text-white px-3 py-1 rounded shadow hover:bg-blue-600"
        >
          Ordenar por Total
        </button>
      </div>

      {/* tabla */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Pago</TableHead>
              <TableHead>Productos</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-200">
            {paginatedOrders.map((order) => (
              <TableRow
                key={order.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.client}</TableCell>
                <TableCell className="font-semibold">${order.total.toFixed(2)}</TableCell>
                <TableCell>
                  {new Date(order.date).toLocaleString("es-AR", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell
                  className={
                    order.paymentStatus.toLowerCase() === "paid"
                      ? "text-green-600 font-semibold"
                      : "text-red-600 font-semibold"
                  }
                >
                  {order.paymentStatus}
                </TableCell>
                <TableCell>
                  {(expandedRows.has(order.id)
                    ? order.orderProducts
                    : order.orderProducts.slice(0, 2)
                  ).map((p, idx) => (
                    <div key={`${order.id}-${p.name}-${idx}`}>
                      {p.name} x{p.quantity}
                    </div>
                  ))}

                  {order.orderProducts.length > 2 && (
                    <button
                      className="text-blue-500 text-sm mt-1 hover:underline"
                      onClick={() => toggleRow(order.id)}
                    >
                      {expandedRows.has(order.id)
                        ? "Mostrar menos"
                        : `+${order.orderProducts.length - 2} más`}
                    </button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* paginación */}
      <div className="mt-6 flex justify-center gap-3 items-center">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-1 rounded bg-gray-300 hover:bg-gray-400 disabled:opacity-50"
        >
          Anterior
        </button>

        <span className="font-medium">
          Página {page} / {totalPages}
        </span>

        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-4 py-1 rounded bg-gray-300 hover:bg-gray-400 disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
