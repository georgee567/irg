"use client";

import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { Product } from "@/types/models";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SearchOverlay({
  open,
  onClose,
}: Props) {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch("/api/products", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Unable to load products.");
        }

        const data = await response.json();
        setProducts(data.products ?? []);
      } catch (error) {
        console.error("Load products error:", error);
      }
    }

    loadProducts();
  }, []);

  const filtered = useMemo(() => {
    if (!query) return [];

    return products.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, products]);

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
                KSh {Number(product.price).toLocaleString()}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}