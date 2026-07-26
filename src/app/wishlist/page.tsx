"use client";

import Image from "next/image";

import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

export default function WishlistPage() {

  const {
    wishlist,
    removeFromWishlist,
  } = useWishlist();

  const { addToCart } = useCart();

  return (

    <main className="min-h-screen bg-black text-white">

      <div className="mx-auto max-w-7xl px-8 py-24">

        <h1 className="font-serif text-6xl">
          Wishlist
        </h1>

        <div className="mt-14 grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {wishlist.map((item) => (

            <div
              key={item.id}
              className="overflow-hidden rounded-3xl border border-[#222]"
            >

              <div className="relative h-80">

                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />

              </div>

              <div className="p-6">

                <h2 className="font-serif text-2xl">
                  {item.name}
                </h2>

                <p className="mt-4 text-[#D4AF37]">
                  KSh {item.price.toLocaleString()}
                </p>

                <button
                  onClick={() =>
                    addToCart({
                      ...item,
                      quantity: 1,
                    })
                  }
                  className="mt-6 w-full rounded-xl bg-[#D4AF37] py-3 font-bold text-black"
                >
                  Add To Cart
                </button>

                <button
                  onClick={() =>
                    removeFromWishlist(item.id)
                  }
                  className="mt-3 w-full rounded-xl border border-red-500 py-3 text-red-500"
                >
                  Remove
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

    </main>

  );

}