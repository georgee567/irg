"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Product } from "@/types/models";

interface Props {
  productId: string;
  categoryId: string;
}

export default function RelatedProducts({
  productId,
  categoryId,
}: Props) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadRelated() {
      try {
        const response = await fetch("/api/products", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Unable to load products.");
        }

        const data = await response.json();

        const related = (data.products ?? []).filter(
          (product: Product) =>
            product.id !== productId &&
            product.categoryId === categoryId
        );

        setProducts(related.slice(0, 4));
      } catch (error) {
        console.error("Load related products error:", error);
      }
    }

    loadRelated();
  }, [productId, categoryId]);

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="mt-32">
      <div className="mb-12 flex items-center justify-between">
        <h2 className="font-serif text-5xl">
          You May Also Like
        </h2>

        <Link
          href="/shop"
          className="text-[#D4AF37]"
        >
          View All →
        </Link>
      </div>

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => (
          <Link
            href={`/product/${product.id}`}
            key={product.id}
            className="overflow-hidden rounded-3xl border border-[#222]"
          >
            <div className="relative h-80">
              <Image
                src={product.images?.[0] ?? "/images/products/jacket-01.jpg"}
                alt={product.name}
                fill
                className="object-cover transition duration-700 hover:scale-110"
              />
            </div>

            <div className="p-6">
              <h3 className="font-serif text-2xl">
                {product.name}
              </h3>

              <p className="mt-3 text-[#D4AF37]">
                KSh {Number(product.price).toLocaleString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}