"use client";

import Image from "next/image";
import Link from "next/link";

import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const shipping = cart.length > 0 ? 500 : 0;

  const tax = subtotal * 0.16;

  const total = subtotal + shipping + tax;

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-8 py-20">

        <h1 className="font-serif text-6xl">
          Shopping Cart
        </h1>

        {cart.length === 0 ? (

          <div className="py-28">

            <p className="text-gray-400">
              Your cart is empty.
            </p>

            <Link
              href="/shop"
              className="mt-8 inline-block rounded-xl bg-[#D4AF37] px-8 py-4 font-semibold text-black"
            >
              Shop Now
            </Link>

          </div>

        ) : (

          <>
            <div className="mt-16 space-y-8">

              {cart.map((item) => (

                <div
                  key={item.id}
                  className="flex items-center gap-8 rounded-3xl border border-[#222] p-6"
                >

                  <div className="relative h-40 w-40">

                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="rounded-2xl object-cover"
                    />

                  </div>

                  <div className="flex-1">

                    <h2 className="font-serif text-3xl">
                      {item.name}
                    </h2>

                    <p className="mt-3 text-[#D4AF37]">
                      KSh {item.price.toLocaleString()}
                    </p>

                    <div className="mt-6 flex items-center gap-3">

                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        className="h-10 w-10 rounded-full border"
                      >
                        −
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() => increaseQuantity(item.id)}
                        className="h-10 w-10 rounded-full border"
                      >
                        +
                      </button>

                    </div>

                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="rounded-xl border border-red-500 px-5 py-3 text-red-500"
                  >
                    Remove
                  </button>

                </div>

              ))}

            </div>

            <div className="mt-20 rounded-3xl border border-[#222] p-10">

              <div className="mb-4 flex justify-between">
                <span>Subtotal</span>
                <span>KSh {subtotal.toLocaleString()}</span>
              </div>

              <div className="mb-4 flex justify-between">
                <span>Shipping</span>
                <span>KSh {shipping.toLocaleString()}</span>
              </div>

              <div className="mb-4 flex justify-between">
                <span>VAT (16%)</span>
                <span>KSh {tax.toLocaleString()}</span>
              </div>

              <hr className="my-6 border-[#222]" />

              <div className="flex justify-between text-3xl font-bold">

                <span>Total</span>

                <span className="text-[#D4AF37]">
                  KSh {total.toLocaleString()}
                </span>

              </div>

              <button
                onClick={clearCart}
                className="mt-8 w-full rounded-xl border border-red-500 py-4 text-red-500 transition hover:bg-red-500 hover:text-white"
              >
                Clear Cart
              </button>

              <Link
                href="/checkout"
                className="mt-5 block rounded-xl bg-[#D4AF37] py-5 text-center text-lg font-semibold text-black"
              >
                Proceed To Checkout
              </Link>

            </div>

          </>

        )}

      </div>
    </main>
  );
}