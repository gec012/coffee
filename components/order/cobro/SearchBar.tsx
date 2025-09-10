'use client';
import { ChangeEvent } from 'react';

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function SearchBar({ value, onChange }: Props) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
      placeholder="Buscar mesa..."
      className="mb-4 p-2 border rounded w-full"
    />
  );
}
