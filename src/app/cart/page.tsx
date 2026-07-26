"use client";

import Link from "next/link";
import Image from "next/image";

import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <main className="min-h-screen bg-black text-white">

      <div className="mx-auto max-w-7xl px-8 py-24">

        <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]">
          Shopping Cart
        </p>

        <h1 className="mt-5 font-serif text-6xl">
          Your Cart
        </h1>

        <div className="mt-16 grid gap-10 lg:grid-cols-[2fr_1fr]">

          <div className="rounded-3xl border border-[#222] bg-[#090909] p-8">

            {cart.length === 0 ? (

              <div className="text-center py-16">

                <h2 className="text-3xl font-serif">
                  Your cart is empty
                </h2>

                <Link
                  href="/shop"
                  className="mt-8 inline-block rounded-xl bg-[#D4AF37] px-8 py-4 font-semibold text-black"
                >
                  Continue Shopping
                </Link>

              </div>

            ) : (

              cart.map((item) => (

                <div
                  key={item.id}
                  className="mb-8 flex items-center gap-6 border-b border-[#222] pb-8"
                >

                  <div className="relative h-28 w-28 overflow-hidden rounded-xl">

                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />

                  </div>

                  <div className="flex-1">

                    <h2 className="text-2xl font-serif">
                      {item.name}
                    </h2>

                    <p className="mt-2 text-[#D4AF37]">
                      KSh {item.price.toLocaleString()}
                    </p>

                    <div className="mt-5 flex items-center gap-3">

                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        className="h-10 w-10 rounded-full border border-[#333]"
                      >
                        -
                      </button>

                      <span className="w-8 text-center">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => increaseQuantity(item.id)}
                        className="h-10 w-10 rounded-full border border-[#333]"
                      >
                        +
                      </button>

                    </div>

                  </div>

                  <div className="text-right">

                    <p className="text-xl font-bold text-[#D4AF37]">
                      KSh {(item.price * item.quantity).toLocaleString()}
                    </p>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="mt-4 text-red-500"
                    >
                      Remove
                    </button>

                  </div>

                </div>

              ))

            )}

          </div>

          <div className="rounded-3xl border border-[#222] bg-[#090909] p-8">

            <h2 className="text-3xl font-serif">
              Summary
            </h2>

            <div className="mt-8 flex justify-between">

              <span>Subtotal</span>

              <span>
                KSh {subtotal.toLocaleString()}
              </span>

            </div>

            <div className="mt-5 flex justify-between">

              <span>Shipping</span>

              <span>Free</span>

            </div>

            <div className="mt-8 border-t border-[#222] pt-6 flex justify-between text-2xl font-bold">

              <span>Total</span>

              <span className="text-[#D4AF37]">
                KSh {subtotal.toLocaleString()}
              </span>

            </div>

            <Link
              href="/checkout"
              className="mt-8 block rounded-xl bg-[#D4AF37] py-4 text-center font-bold text-black"
            >
              Proceed to Checkout
            </Link>

          </div>

        </div>

      </div>

    </main>
  );
}