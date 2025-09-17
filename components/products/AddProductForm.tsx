'use client';
import React, { ReactElement, cloneElement } from "react";
import { useRouter } from "next/navigation";

interface Props {
  children: ReactElement<{ onSubmit?: (data: any) => void }>;
}

export default function AddProductForm({ children }: Props) {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    let imageUrl = "";

    if (data.imageFile) {
      const formData = new FormData();
      formData.append("file", data.imageFile);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const json = await res.json();
      imageUrl = json.url;
    }

    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, image: imageUrl }),
    });

    alert("Producto creado!");
    router.push("/admin/products");
  };

  return cloneElement(children, { onSubmit: handleSubmit });
}
