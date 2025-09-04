

export default function Heading({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-teal-500 text-white rounded-xl p-6 mb-8 shadow-md flex flex-col items-center text-center">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-2">{children}</h1>
      <p className="text-sm md:text-base text-teal-100">
        Seleccioná los productos que quieras y personalizá tu pedido
      </p>
    </div>
  );
}
