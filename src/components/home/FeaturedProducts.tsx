"use client";

import Image from "next/image";
import Link from "next/link";

import { useCart } from "@/context/CartContext";
import type { SiteContent } from "@/lib/site-content";

const defaultContent: SiteContent = {
  productsEyebrow: "Our Products",
  productsTitle: "IRG Collection",
  productsButton: "View All",
};

interface Variant {
  id: string;
  stock: number;
}

interface Product {
  id: string;
  name: string;
  price: string | number;
  images: string[];
  variants: Variant[];
}

export default function FeaturedProducts({
  content = defaultContent,
  products,
}: {
  content?: SiteContent;
  products: Product[];
}) {
  const { addToCart } = useCart();

  return (
    <section className="bg-[#050505] py-28">
      <div className="mx-auto max-w-7xl px-8">
        <div className="mb-16 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]">
              {content.productsEyebrow}
            </p>

            <h2 className="mt-4 font-serif text-5xl text-white">
              {content.productsTitle}
            </h2>
          </div>

          <Link
            href="/shop"
            className="border border-[#D4AF37] px-6 py-3 text-xs uppercase tracking-[0.3em] text-[#D4AF37]"
          >
            {content.productsButton}
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => {
            const variant = product.variants.find(
              (item) => item.stock > 0
            );

            return (
              <div
                key={product.id}
                className="group overflow-hidden rounded-3xl border border-[#222] bg-black"
              >
                <Link href={`/product/${product.id}`}>
                  <div className="relative h-[360px]">
                    {product.images?.[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover transition duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-[#111] text-sm text-gray-500">
                        Image coming soon
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="font-serif text-2xl text-white">
                      {product.name}
                    </h3>

                    <p className="mt-4 text-[#D4AF37]">
                      KSh {Number(product.price).toLocaleString()}
                    </p>
                  </div>
                </Link>

                <div className="px-6 pb-6">
                  <button
                    disabled={!variant}
                    onClick={async () => {
                      if (!variant) return;

                      try {
                        await addToCart(variant.id, 1);
                      } catch (error) {
                        console.error("Add to cart error:", error);
                      }
                    }}
                    className="w-full rounded-md border border-[#D4AF37] py-3 uppercase tracking-[0.25em] text-[#D4AF37] transition hover:bg-[#D4AF37] hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {variant ? "Add To Cart" : "Sold Out"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        {products.length === 0 ? (
          <p className="mt-8 text-center text-gray-400">
            No products are available right now.
          </p>
        ) : null}
      </div>
    </section>
  );
}