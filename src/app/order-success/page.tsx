"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface OrderSummary {
  id: string;
  total: number;
  payment: string;
  paymentStatus?: string;
  date: string;
  customer?: {
    fullName: string;
    email: string;
    phone: string;
    county: string;
    city: string;
    address: string;
  };
}

export default function OrderSuccessPage() {
  const [order, setOrder] = useState<OrderSummary | null>(null);

  useEffect(() => {
    // Load order from localStorage after hydration
    const saved = JSON.parse(localStorage.getItem("irg-orders") || "[]") as OrderSummary[];
    if (saved[0]) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOrder(saved[0]);
    }
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-8 py-24 text-white">
      <div className="max-w-2xl rounded-[32px] border border-[#222] bg-[#090909] p-10 text-center">
        <h1 className="font-serif text-6xl text-[#D4AF37]">Thank You</h1>
        <p className="mt-6 text-xl text-gray-400">Your order has been placed successfully.</p>

        {order ? (
          <div className="mt-8 rounded-2xl border border-[#222] p-6 text-left">
            <p className="text-sm uppercase tracking-[0.25em] text-gray-500">Order reference</p>
            <p className="mt-2 font-semibold">{order.id}</p>
            <p className="mt-4 text-sm text-gray-400">Placed on {order.date}</p>
            <p className="mt-4 text-sm text-gray-400">Payment method: {order.payment}</p>
            {order.paymentStatus ? <p className="mt-4 text-sm text-gray-400">Status: {order.paymentStatus}</p> : null}
            {order.customer ? <p className="mt-4 text-sm text-gray-400">Delivery for {order.customer.fullName}</p> : null}
            <p className="mt-4 text-lg text-[#D4AF37]">Total: KSh {order.total.toLocaleString()}</p>
          </div>
        ) : null}

        <Link href="/orders" className="mt-10 inline-block rounded-xl bg-[#D4AF37] px-10 py-5 font-bold text-black">
          View Orders
        </Link>
      </div>
    </main>
  );
}