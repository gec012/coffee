

type HeadingProps = {
  children: React.ReactNode;
  subtitle?: string; // nuevo prop opcional
};

export default function Heading({ children, subtitle }: HeadingProps) {
  return (
    <div className="bg-teal-500 text-white rounded-xl p-6 mb-8 shadow-md flex flex-col items-center text-center">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-2">{children}</h1>
      {subtitle && (
        <p className="text-sm md:text-base text-teal-100">{subtitle}</p>
      )}
    </div>
  );
}

