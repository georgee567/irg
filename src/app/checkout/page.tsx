"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useCart } from "@/context/CartContext";

import PaymentMethods from "@/components/checkout/PaymentMethods";
import PromoCode from "@/components/checkout/PromoCode";
import MpesaForm from "@/components/checkout/MpesaForm";
import CardForm from "@/components/checkout/CardForm";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();

  const router = useRouter();

  const [payment, setPayment] = useState("M-Pesa");
  const [discount, setDiscount] = useState(0);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const discountAmount = subtotal * (discount / 100);

  const total = subtotal - discountAmount;

  function placeOrder() {
    if (
      !fullName ||
      !email ||
      !phone ||
      !address
    ) {
      alert("Please fill all required fields.");
      return;
    }

    const order = {
      id: "IRG-" + Date.now(),
      date: new Date().toLocaleDateString(),
      status: "Processing",
      payment,
      customer: {
        fullName,
        email,
        phone,
        address,
      },
      subtotal,
      discount,
      total,
      items: cart,
    };

    const existingOrders = JSON.parse(
      localStorage.getItem("irg-orders") || "[]"
    );

    existingOrders.unshift(order);

    localStorage.setItem(
      "irg-orders",
      JSON.stringify(existingOrders)
    );

    clearCart();

    router.push("/order-success");
  }

  return (
    <main className="min-h-screen bg-black text-white">

      <div className="mx-auto max-w-7xl px-8 py-24">

        <h1 className="font-serif text-6xl">
          Checkout
        </h1>

        <div className="mt-16 grid gap-14 lg:grid-cols-2">

          {/* LEFT */}

          <div>

            <h2 className="mb-8 font-serif text-3xl">
              Customer Details
            </h2>

            <div className="space-y-5">

              <input
                value={fullName}
                onChange={(e) =>
                  setFullName(e.target.value)
                }
                placeholder="Full Name"
                className="w-full rounded-xl border border-[#222] bg-[#090909] p-4 outline-none"
              />

              <input
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="Email Address"
                className="w-full rounded-xl border border-[#222] bg-[#090909] p-4 outline-none"
              />

              <input
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value)
                }
                placeholder="Phone Number"
                className="w-full rounded-xl border border-[#222] bg-[#090909] p-4 outline-none"
              />

              <textarea
                rows={4}
                value={address}
                onChange={(e) =>
                  setAddress(e.target.value)
                }
                placeholder="Delivery Address"
                className="w-full rounded-xl border border-[#222] bg-[#090909] p-4 outline-none"
              />

            </div>

            <PaymentMethods
              payment={payment}
              setPayment={setPayment}
            />

            {payment === "M-Pesa" && (
              <MpesaForm />
            )}

            {(payment === "Visa" ||
              payment === "Mastercard") && (
              <CardForm />
            )}

            <PromoCode
              onApply={setDiscount}
            />

          </div>

          {/* RIGHT */}

          <div className="rounded-3xl border border-[#222] bg-[#090909] p-8">

            <h2 className="font-serif text-3xl">
              Order Summary
            </h2>

            <div className="mt-10 space-y-5">

              {cart.length === 0 ? (

                <p className="text-gray-500">
                  Your cart is empty.
                </p>

              ) : (

                cart.map((item) => (

                  <div
                    key={item.id}
                    className="flex justify-between"
                  >

                    <div>

                      <h3>
                        {item.name}
                      </h3>

                      <p className="text-sm text-gray-400">
                        Qty: {item.quantity}
                      </p>

                    </div>

                    <p className="font-semibold text-[#D4AF37]">

                      KSh{" "}
                      {(
                        item.price * item.quantity
                      ).toLocaleString()}

                    </p>

                  </div>

                ))

              )}

            </div>

            <div className="mt-10 border-t border-[#222] pt-6 space-y-4">

              <div className="flex justify-between">

                <span>Subtotal</span>

                <span>
                  KSh {subtotal.toLocaleString()}
                </span>

              </div>

              <div className="flex justify-between">

                <span>Discount</span>

                <span>
                  - KSh{" "}
                  {discountAmount.toLocaleString()}
                </span>

              </div>

              <div className="flex justify-between">

                <span>Payment</span>

                <span className="text-[#D4AF37]">
                  {payment}
                </span>

              </div>

              <div className="flex justify-between border-t border-[#222] pt-5 text-2xl font-bold">

                <span>Total</span>

                <span className="text-[#D4AF37]">
                  KSh {total.toLocaleString()}
                </span>

              </div>

            </div>

            <button
              onClick={placeOrder}
              className="mt-10 w-full rounded-xl bg-[#D4AF37] py-5 font-bold text-black transition hover:opacity-90"
            >
              Place Order
            </button>

          </div>

        </div>

      </div>

    </main>
  );
}