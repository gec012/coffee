'use client'
import { useEffect } from "react";
import useSWR from "swr";
import OrderCard from "@/components/order/OrderCard";
import Heading from "@/components/ui/Heading";
import { OrderWithProducts } from "@/src/types";
import { toast } from "react-toastify";

export default function OrdersPage() {
  const url = '/admin/orders/api';
  const fetcher = () =>
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Error al cargar las órdenes');
        return res.json();
      })
      .then(data => data);

  const { data, error, isLoading } = useSWR<OrderWithProducts[]>(url, fetcher, {
    refreshInterval: 60000,
    revalidateOnFocus: true
  });

  // Mostrar toast solo una vez si hay error
  useEffect(() => {
    if (error) {
      toast.error("No se pudieron cargar las órdenes");
    }
  }, [error]);

  if (isLoading) return <p className="text-center mt-5">Cargando...</p>;

  if (error) return <p className="text-center mt-5 text-red-500">Error al cargar las órdenes</p>;

  return (
    <>
      <Heading subtitle="Aquí se muestran los pedidos que deben ser preparados y despachados">
  Pedidos para Cocina
</Heading>



      {data && data.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-5 mt-5">
          {data.map(order => (
            <OrderCard
              key={order.id}
              order={order}
            />
          ))}
        </div>
      ) : (
        <p className="text-center mt-5 text-gray-500">No hay órdenes pendientes</p>
      )}
    </>
  );
}

