// RootLayout.tsx
'use client';

import { useState, useMemo } from "react";
import OrderSidebar from "@/components/order/OrderSidebar";
import OrderSummary from "@/components/order/OrderSummary";
import ToastNotification from "@/components/ui/ToastNotification";
import { useStore } from "@/src/store";

type Props = {
  children: React.ReactNode;
  role?: "client" | "waiter" | "admin"; 
  tableId?: string; 
};

export default function RootLayout({ children, role = "client", tableId }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const order = useStore((state) => state.order);

  // Total de unidades en todo el carrito
  const totalItems = useMemo(() => 
    order.reduce((sum, item) => sum + item.quantity, 0), [order]);

  return (
    <>
      {/* Botón hamburguesa solo móviles */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-sky-600 text-white rounded-lg"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰
      </button>

      {/* Icono carrito móvil */}
      <button
        className="md:hidden fixed top-4 right-4 z-50 p-2 bg-sky-600 text-white rounded-full flex items-center justify-center"
        onClick={() => setCartOpen(true)}
      >
        🛒
        {totalItems > 0 && (
          <span className="ml-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {totalItems}
          </span>
        )}
      </button>

      <div className="md:flex md:h-screen">
        {/* Sidebar */}
        <div className={`
          fixed md:static top-0 left-0 z-40 md:z-auto h-full w-64 bg-slate-100 transform
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        `}>
          <OrderSidebar
            isOpen={sidebarOpen}
            onSelectCategory={() => setSidebarOpen(false)}
          />
        </div>

        {/* Contenido principal */}
        <main className="flex-1 md:overflow-y-auto p-5 md:h-full">
          {children}
        </main>

        {/* Carrito / Resumen desktop */}
        <div className="hidden md:block md:w-96 md:h-full md:static relative z-30">
          <OrderSummary role={role} tableId={tableId} />
        </div>
      </div>

      {/* Modal carrito móvil */}
      {cartOpen && (
        <div className="fixed inset-0 bg-black/30 z-50 flex justify-end">
          <div className="bg-white w-full md:w-96 h-full p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Mi Pedido</h2>
              <button
                className="text-gray-500 hover:text-gray-800"
                onClick={() => setCartOpen(false)}
              >
                ✕
              </button>
            </div>
            <OrderSummary role={role} tableId={tableId} />
          </div>
        </div>
      )}

      <ToastNotification />
    </>
  );
}
