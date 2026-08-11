"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";

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
  const [county, setCounty] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 500 : 0;
  const tax = subtotal * 0.16;
  const discountAmount = subtotal * (discount / 100);
  const total = subtotal + shipping + tax - discountAmount;

  const placeOrder = useCallback(() => {
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    if (!fullName || !email || !phone || !county || !city || !address) {
      alert("Please fill all required fields.");
      return;
    }

    const timestamp = Date.now();
    const currentDate = new Date().toLocaleDateString();
    const order = {
      id: `IRG-${timestamp}`,
      date: currentDate,
      status: "Processing",
      payment,
      customer: {
        fullName,
        email,
        phone,
        county,
        city,
        address,
      },
      subtotal,
      shipping,
      tax,
      discount,
      total,
      items: cart.map((item) => ({ name: item.name, quantity: item.quantity, price: item.price, selectedSize: item.selectedSize, selectedColor: item.selectedColor })),
    };

    const existingOrders = JSON.parse(localStorage.getItem("irg-orders") || "[]");
    existingOrders.unshift(order);
    localStorage.setItem("irg-orders", JSON.stringify(existingOrders));

    clearCart();
    router.push("/order-success");
  }, [cart, clearCart, router, fullName, email, phone, county, city, address, payment, discount, subtotal, shipping, tax, total]);

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
            {payment === "M-Pesa" ? <MpesaForm /> : null}
            {payment === "Visa" || payment === "Mastercard" ? <CardForm /> : null}
            <div className="mt-6 rounded-2xl border border-[#222] bg-[#090909] p-5 text-sm text-gray-400">
              Payment methods shown here are UI placeholders for future provider integration. No live payment provider is connected yet.
            </div>
            <PromoCode onApply={setDiscount} />
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
              <div className="flex justify-between"><span>Tax</span><span>KSh {tax.toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Discount</span><span>- KSh {discountAmount.toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Payment</span><span className="text-[#D4AF37]">{payment}</span></div>
              <div className="flex justify-between border-t border-[#222] pt-5 text-2xl font-bold"><span>Total</span><span className="text-[#D4AF37]">KSh {total.toLocaleString()}</span></div>
            </div>

            <button onClick={placeOrder} className="mt-10 w-full rounded-xl bg-[#D4AF37] py-5 font-bold text-black transition hover:opacity-90">
              Place Order
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}