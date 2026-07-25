"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";

import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export default function FeaturedProducts() {
  const { addToCart } = useCart();

  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  } = useWishlist();

  return (
    <section className="bg-[#050505] py-28">
      <div className="mx-auto max-w-7xl px-8">

        <div className="mb-16 flex items-end justify-between">

          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]">
              IRG Signature Stock
            </p>

            <h2 className="mt-4 font-serif text-5xl md:text-6xl">
              Shop The Collection
            </h2>

            <p className="mt-6 max-w-2xl text-lg text-gray-400">
              Luxury streetwear crafted for the next generation.
            </p>
          </div>

          <Link
            href="/shop"
            className="hidden rounded-full border border-[#D4AF37] px-8 py-3 text-[#D4AF37] transition hover:bg-[#D4AF37] hover:text-black lg:block"
          >
            View All
          </Link>

        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">

          {products.slice(0, 8).map((product) => {

            const liked = isInWishlist(product.id);

            return (

              <div
                key={product.id}
                className="group overflow-hidden rounded-3xl border border-[#222] bg-[#090909]"
              >

                <div className="relative h-[360px] overflow-hidden">

                  <Link href={`/product/${product.id}`}>

                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-110"
                    />

                  </Link>

                  {product.badge && (
                    <span className="absolute left-5 top-5 rounded-full bg-[#D4AF37] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-black">
                      {product.badge}
                    </span>
                  )}

                  <button
                    onClick={() =>
                      liked
                        ? removeFromWishlist(product.id)
                        : addToWishlist(product)
                    }
                    className="absolute right-5 top-5 rounded-full bg-black/70 p-3 backdrop-blur"
                  >
                    <Heart
                      size={18}
                      className={
                        liked
                          ? "fill-red-500 text-red-500"
                          : "text-white"
                      }
                    />
                  </button>

                </div>

                <div className="space-y-4 p-6">

                  <p className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]">
                    {product.category}
                  </p>

                  <h3 className="font-serif text-2xl">
                    {product.name}
                  </h3>

                  <p className="text-xl font-semibold">
                    KSh {product.price.toLocaleString()}
                  </p>

                  <button
                    onClick={() =>
                      addToCart({
                        id: product.id,
                        name: product.name,
                        image: product.image,
                        price: product.price,
                        quantity: 1,
                      })
                    }
                    className="w-full rounded-xl bg-[#D4AF37] py-3 font-semibold text-black transition hover:opacity-90"
                  >
                    Add To Cart
                  </button>

                </div>

              </div>

            );
          })}

        </div>

      </div>
    </section>
  );
}