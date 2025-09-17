"use client";

import { useEffect, useState } from "react";

interface PaymentData {
  id: number;
  status: string;
  total: number;
  qr_code_base64?: string;
}

interface PageProps {
  params: { orderId: string };
}

export default function OrderPage({ params }: PageProps) {
  const { orderId } = params;
  const [payment, setPayment] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function createPayment() {
      try {
        const res = await fetch("/api/create-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId }),
        });

        if (!res.ok) throw new Error("Error al crear el pago");

        const data = await res.json();
        setPayment(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    createPayment();
  }, [orderId]);

  if (loading) return <p>Cargando orden...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
   <div className="flex flex-col items-center justify-center p-4">
  <h1 className="text-2xl font-bold mb-4">Orden {payment?.id}</h1>
  <p className="text-lg mb-4">Total: ${payment?.total}</p>

  {payment?.qr_code_base64 ? (
    <div className="border-4 border-gray-300 p-4 rounded-lg mb-4">
      <p className="mb-2 font-medium text-center">Escaneá el QR con tu celular</p>
      <img
        src={payment.qr_code_base64}
        alt="QR de la orden"
        className="w-72 h-72 sm:w-96 sm:h-96 mx-auto"
      />
    </div>
  ) : (
    <p>No se pudo generar el QR</p>
  )}

  <p className="mt-2 text-lg">
    Estado del pago: <span className="font-semibold">{payment?.status}</span>
  </p>

  {/* BOTÓN PARA SIMULAR PAGO */}
  <button
    className="mt-6 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg shadow"
    onClick={async () => {
      try {
        const res = await fetch("/api/pay-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId }),
        });

        if (!res.ok) throw new Error("Error al pagar la orden");

        const data = await res.json();
        setPayment((prev) =>
          prev ? { ...prev, status: data.status } : prev
        );
        alert(data.message);
      } catch (err: any) {
        alert(err.message);
      }
    }}
  >
    Simular pago
  </button>

  {/* BOTÓN PARA DESCARGAR PDF SOLO SI ESTÁ PAGADO */}
{payment?.status === "pagado" && (
  <button
    className="mt-4 px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded"
    onClick={() => {
      window.open(`/api/orders/${orderId}/generate-pdf`, "_blank");
    }}
  >
    Descargar PDF
  </button>
)}

</div>

  );
}
