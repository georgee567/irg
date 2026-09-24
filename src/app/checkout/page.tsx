"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

import PaymentMethods from "@/components/checkout/PaymentMethods";
import MpesaForm from "@/components/checkout/MpesaForm";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [payment, setPayment] = useState("M-Pesa");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [county, setCounty] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 0;
  const total = subtotal;

  const placeOrder = useCallback(async () => {
    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    if (!fullName || !email || !phone || !county || !city || !address) {
      setError("Please fill all required fields.");
      return;
    }

    if (!user) {
      setError("Please log in to place an order.");
      return;
    }

    try {
      setPlacing(true);
      setError("");

      const response = await fetch("/api/orders", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shippingName: fullName,
          shippingEmail: email,
          shippingPhone: phone,
          shippingAddress: address,
          shippingCity: city,
          shippingCountry: county,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to place order.");
      }

      const paymentResponse = await fetch("/api/payments/mpesa", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: data.order.id, phoneNumber: phone }),
      });
      const paymentData = await paymentResponse.json();
      if (!paymentResponse.ok) {
        throw new Error(paymentData.error || "Unable to initiate M-Pesa payment.");
      }

      await clearCart();

      router.push(`/order-success?orderId=${data.order.id}&payment=pending`);
    } catch (error) {
      console.error("Place order error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to place order."
      );
    } finally {
      setPlacing(false);
    }
  }, [cart, clearCart, router, user, fullName, email, phone, county, city, address]);

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-black px-8 py-24 text-white">
        <div className="mx-auto max-w-4xl rounded-[32px] border border-[#222] bg-[#090909] p-10 text-center">
          <h1 className="font-serif text-5xl">Checkout</h1>
          <p className="mt-6 text-gray-400">Your cart is empty. Add a few pieces before you place an order.</p>
          <Link href="/shop" className="mt-8 inline-block rounded-xl bg-[#D4AF37] px-8 py-4 font-semibold text-black">
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-8 py-24 text-white">
      <div className="mx-auto max-w-7xl">
        <h1 className="font-serif text-6xl">Checkout</h1>

        <div className="mt-16 grid gap-14 lg:grid-cols-2">
          <div>
            <h2 className="mb-8 font-serif text-3xl">Customer Details</h2>
            <div className="space-y-5">
              <input value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Full Name" className="w-full rounded-xl border border-[#222] bg-[#090909] p-4 outline-none" />
              <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email Address" className="w-full rounded-xl border border-[#222] bg-[#090909] p-4 outline-none" />
              <input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Phone Number" className="w-full rounded-xl border border-[#222] bg-[#090909] p-4 outline-none" />
              <input value={county} onChange={(event) => setCounty(event.target.value)} placeholder="County" className="w-full rounded-xl border border-[#222] bg-[#090909] p-4 outline-none" />
              <input value={city} onChange={(event) => setCity(event.target.value)} placeholder="Town / City" className="w-full rounded-xl border border-[#222] bg-[#090909] p-4 outline-none" />
              <textarea rows={4} value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Delivery Address" className="w-full rounded-xl border border-[#222] bg-[#090909] p-4 outline-none" />
            </div>

            <PaymentMethods payment={payment} setPayment={setPayment} />
            <MpesaForm value={phone} onChange={setPhone} />
          </div>

          <div className="rounded-3xl border border-[#222] bg-[#090909] p-8">
            <h2 className="font-serif text-3xl">Order Summary</h2>

            <div className="mt-10 space-y-5">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <div>
                    <h3>{item.name}</h3>
                    <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-[#D4AF37]">KSh {(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 space-y-4 border-t border-[#222] pt-6">
              <div className="flex justify-between"><span>Subtotal</span><span>KSh {subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>KSh {shipping.toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Payment</span><span className="text-[#D4AF37]">{payment}</span></div>
              <div className="flex justify-between border-t border-[#222] pt-5 text-2xl font-bold"><span>Total</span><span className="text-[#D4AF37]">KSh {total.toLocaleString()}</span></div>
            </div>

            {error && (
              <p className="mt-4 text-sm text-red-500">{error}</p>
            )}

            <button
              onClick={placeOrder}
              disabled={placing}
              className="mt-10 w-full rounded-xl bg-[#D4AF37] py-5 font-bold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {placing ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}