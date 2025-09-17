'use client';
import { useState, useEffect } from "react";

interface Props {
  image?: string;
  onChange: (file: File | null) => void;
}

export default function ImageUpload({ image, onChange }: Props) {
  const [preview, setPreview] = useState<string | null>(image || null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onChange(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="space-y-2">
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {preview && <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded" />}
    </div>
  );
}
