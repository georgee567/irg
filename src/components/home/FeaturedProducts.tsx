"use client";

import Image from "next/image";
import Link from "next/link";

import { useCart } from "@/context/CartContext";
import { products } from "@/data/products";

export default function FeaturedProducts() {
  const { addToCart } = useCart();

  return (
    <section className="bg-[#050505] py-28">
      <div className="mx-auto max-w-7xl px-8">

        <div className="mb-16 flex items-end justify-between">

          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]">
              Featured
            </p>

            <h2 className="mt-4 font-serif text-5xl text-white">
              IRG Signature Collection
            </h2>
          </div>

          <Link
            href="/shop"
            className="border border-[#D4AF37] px-6 py-3 text-xs uppercase tracking-[0.3em] text-[#D4AF37]"
          >
            View All
          </Link>

        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">

          {products.map((product) => (

            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="group overflow-hidden rounded-3xl border border-[#222] bg-black"
            >

              <div className="relative h-[360px]">

                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-110"
                />

              </div>

              <div className="p-6">

                <h3 className="font-serif text-2xl text-white">
                  {product.name}
                </h3>

                <p className="mt-4 text-[#D4AF37]">
                  KSh {product.price.toLocaleString()}
                </p>

                <button
                  onClick={(e) => {
                    e.preventDefault();

                    addToCart({
                      id: product.id,
                      name: product.name,
                      image: product.image,
                      price: product.price,
                      quantity: 1,
                    });
                  }}
                  className="mt-6 w-full rounded-md border border-[#D4AF37] py-3 uppercase tracking-[0.25em] text-[#D4AF37] transition hover:bg-[#D4AF37] hover:text-black"
                >
                  Add To Cart
                </button>

              </div>

            </Link>

          ))}

        </div>

      </div>
    </section>
  );
}