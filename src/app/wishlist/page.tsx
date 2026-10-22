"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, loading } = useWishlist();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  async function handleAddToCart(productId: string) {
    try {
      setLoadingId(productId);
      setMessage("");

      const item = wishlist.find(
        (wishlistItem) => wishlistItem.productId === productId
      );

      if (!item) {
        throw new Error("This product could not be found in your wishlist.");
      }

      const availableVariant = item.product.variants.find(
        (variant) => variant.stock > 0
      );

      if (!availableVariant) {
        throw new Error("This product is currently out of stock.");
      }

      await addToCart(availableVariant.id, 1);

      setMessage("Product added to cart.");
    } catch (error) {
      console.error("Wishlist add to cart error:", error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to add product to cart."
      );
    } finally {
      setLoadingId(null);
    }
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-black px-8 py-24 text-white">
        <div className="mx-auto max-w-4xl rounded-[32px] border border-[#222] bg-[#090909] p-10 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]">
            Your Collection
          </p>
          <h1 className="mt-5 font-serif text-5xl">Sign in to view your wishlist</h1>
          <Link href="/login" className="mt-8 inline-block rounded-xl bg-[#D4AF37] px-8 py-4 font-semibold text-black">
            Go to Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-8 py-24 text-white">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]">
          Your Collection
        </p>

        <h1 className="mt-5 font-serif text-6xl">
          Wishlist
        </h1>

        {message && (
          <p className="mt-6 text-sm text-gray-300">
            {message}
          </p>
        )}

        {loading ? (
          <p className="mt-10 text-gray-400">Loading your wishlist...</p>
        ) : wishlist.length === 0 ? (
          <p className="mt-10 text-gray-400">
            Your wishlist is currently empty.
          </p>
        ) : (
          <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="overflow-hidden rounded-3xl border border-[#222] bg-[#090909]"
              >
                <Link href={`/product/${item.product.id}`}>
                  <div className="relative h-80">
                    {item.product.images?.[0] ? (
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-[#111] text-sm text-gray-500">
                        Image coming soon
                      </div>
                    )}
                  </div>
                </Link>

                <div className="p-6">
                  <h2 className="font-serif text-2xl">
                    {item.product.name}
                  </h2>

                  <p className="mt-4 text-[#D4AF37]">
                    KSh {Number(item.product.price).toLocaleString()}
                  </p>

                  <button
                    type="button"
                    disabled={loadingId === item.product.id}
                    onClick={() =>
                      handleAddToCart(item.product.id)
                    }
                    className="mt-6 w-full rounded-xl bg-[#D4AF37] py-3 font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loadingId === item.product.id
                      ? "Adding..."
                      : "Add To Cart"}
                  </button>

                  <button
                    type="button"
                    onClick={() => removeFromWishlist(item.id)}
                    className="mt-4 w-full rounded-xl border border-[#333] py-3 text-gray-300 transition hover:border-red-500 hover:text-red-500"
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