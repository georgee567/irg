"use client";

import Image from "next/image";
import Link from "next/link";

import { useWishlist } from "@/context/WishlistContext";

export default function WishlistPage() {
  const {
    wishlist,
    removeFromWishlist,
  } = useWishlist();

  return (
    <main className="min-h-screen bg-black text-white">

      <div className="mx-auto max-w-7xl px-8 py-20">

        <h1 className="mb-16 font-serif text-6xl">
          Wishlist
        </h1>

        {wishlist.length === 0 ? (
          <p className="text-gray-400">
            Your wishlist is empty.
          </p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

            {wishlist.map((product) => (

              <div
                key={product.id}
                className="overflow-hidden rounded-3xl border border-[#222]"
              >

                <Link href={`/product/${product.id}`}>

                  <div className="relative h-[320px]">

                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />

                  </div>

                </Link>

                <div className="p-6">

                  <h2 className="font-serif text-2xl">
                    {product.name}
                  </h2>

                  <p className="mt-3 text-[#D4AF37]">
                    KSh {product.price.toLocaleString()}
                  </p>

                  <button
                    onClick={() =>
                      removeFromWishlist(product.id)
                    }
                    className="mt-6 w-full rounded-xl border border-red-500 py-3 text-red-400"
                  >
                    Remove
                  </button>

                </div>

              </div>

            ))}

          </div>
        )}

      </div>

    </main>
  );
}