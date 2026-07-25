"use client";

import { X } from "lucide-react";
import { useMemo, useState } from "react";
import Link from "next/link";

import { products } from "@/data/products";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SearchOverlay({
  open,
  onClose,
}: Props) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query) return [];

    return products.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  return (
    <div
      className={`fixed inset-0 z-[999] transition ${
        open
          ? "pointer-events-auto bg-black/80 backdrop-blur-xl"
          : "pointer-events-none opacity-0"
      }`}
    >
      <div className="mx-auto mt-16 max-w-3xl rounded-3xl bg-[#090909] p-8">

        <div className="mb-6 flex items-center justify-between">

          <h2 className="font-serif text-4xl">
            Search
          </h2>

          <button onClick={onClose}>
            <X />
          </button>

        </div>

        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className="w-full rounded-xl border border-[#222] bg-black p-5"
        />

        <div className="mt-8 space-y-3">

          {filtered.map((product) => (

            <Link
              key={product.id}
              href={`/product/${product.id}`}
              onClick={onClose}
              className="block rounded-xl border border-[#222] p-4 transition hover:border-[#D4AF37]"
            >
              <div className="font-semibold">
                {product.name}
              </div>

              <div className="mt-2 text-sm text-[#D4AF37]">
                KSh {product.price.toLocaleString()}
              </div>
            </Link>

          ))}

        </div>

      </div>

    </div>
  );
}