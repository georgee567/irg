"use client";
import { counties } from "@/data/counties";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
  const { cart } = useCart();

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

        <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]">
          Secure Checkout
        </p>

        <h1 className="mt-4 font-serif text-6xl">
          Checkout
        </h1>

        <div className="mt-16 grid gap-16 lg:grid-cols-2">

          {/* Customer Information */}

          <div className="space-y-6">

            <input
              type="text"
              placeholder="Full Name"
              className="w-full rounded-xl border border-[#222] bg-[#090909] p-5 outline-none focus:border-[#D4AF37]"
            />

            <input
              type="email"
              placeholder="Email Address"
              className="w-full rounded-xl border border-[#222] bg-[#090909] p-5 outline-none focus:border-[#D4AF37]"
            />

            <input
              type="tel"
              placeholder="Phone Number"
              className="w-full rounded-xl border border-[#222] bg-[#090909] p-5 outline-none focus:border-[#D4AF37]"
            />

           <select
  className="w-full rounded-xl border border-[#222] bg-[#090909] p-5 outline-none focus:border-[#D4AF37]"
>
  <option>Select County</option>

  {counties.map((county) => (
    <option
      key={county}
      value={county}
    >
      {county}
    </option>
  ))}
</select>

            <input
              type="text"
              placeholder="Town / City"
              className="w-full rounded-xl border border-[#222] bg-[#090909] p-5 outline-none focus:border-[#D4AF37]"
            />

            <textarea
              rows={5}
              placeholder="Delivery Address"
              className="w-full rounded-xl border border-[#222] bg-[#090909] p-5 outline-none focus:border-[#D4AF37]"
            />

            <div className="rounded-2xl border border-[#222] p-6">
              <h3 className="mb-5 font-serif text-2xl">
                Payment Method
              </h3>

              <div className="space-y-4">

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#222] p-4 hover:border-[#D4AF37]">
                  <input type="radio" name="payment" defaultChecked />
                  <span>M-Pesa</span>
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#222] p-4 hover:border-[#D4AF37]">
                  <input type="radio" name="payment" />
                  <span>Visa</span>
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#222] p-4 hover:border-[#D4AF37]">
                  <input type="radio" name="payment" />
                  <span>Mastercard</span>
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#222] p-4 hover:border-[#D4AF37]">
                  <input type="radio" name="payment" />
                  <span>PayPal</span>
                </label>

              </div>
            </div>

          </div>

          {/* Order Summary */}

          <div className="rounded-3xl border border-[#222] bg-[#090909] p-8">

            <h2 className="font-serif text-3xl">
              Order Summary
            </h2>

            <div className="mt-10 space-y-5">

              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between"
                >
                  <span>
                    {item.name} × {item.quantity}
                  </span>

                  <span>
                    KSh {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}

            </div>

            <div className="mt-10 border-t border-[#222] pt-8 space-y-4">

              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>KSh {subtotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>KSh {shipping.toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span>VAT (16%)</span>
                <span>KSh {tax.toLocaleString()}</span>
              </div>

              <div className="flex justify-between border-t border-[#222] pt-6 text-2xl font-semibold">

                <span>Total</span>

                <span className="text-[#D4AF37]">
                  KSh {total.toLocaleString()}
                </span>

              </div>

            </div>

            <button className="mt-10 w-full rounded-xl bg-[#D4AF37] py-5 font-semibold text-black transition hover:opacity-90">
              Place Order
            </button>

            <Link
              href="/cart"
              className="mt-5 block text-center text-gray-400 hover:text-white"
            >
              ← Back to Cart
            </Link>

          </div>

        </div>

      </div>
    </main>
  );
}