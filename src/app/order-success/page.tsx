"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { Order } from "@/types/models";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      if (!orderId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/orders/${orderId}`, {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Unable to load order.");
        }

        const data = await response.json();
        setOrder(data.order);
      } catch (error) {
        console.error("Load order error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [orderId]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-8 py-24 text-white">
      <div className="max-w-2xl rounded-[32px] border border-[#222] bg-[#090909] p-10 text-center">
        <h1 className="font-serif text-6xl text-[#D4AF37]">Thank You</h1>
        <p className="mt-6 text-xl text-gray-400">Your order has been placed successfully.</p>

        {loading ? (
          <p className="mt-8 text-gray-400">Loading order details...</p>
        ) : order ? (
          <div className="mt-8 rounded-2xl border border-[#222] p-6 text-left">
            <p className="text-sm uppercase tracking-[0.25em] text-gray-500">Order reference</p>
            <p className="mt-2 font-semibold">{order.id}</p>
            <p className="mt-4 text-sm text-gray-400">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
            <p className="mt-4 text-sm text-gray-400">Payment status: {order.paymentStatus}</p>
            <p className="mt-4 text-sm text-gray-400">Delivery for {order.shippingName}</p>
            <p className="mt-4 text-lg text-[#D4AF37]">Total: KSh {Number(order.total).toLocaleString()}</p>
          </div>
        ) : (
          <p className="mt-8 text-gray-400">Order details could not be loaded.</p>
        )}

        <Link href="/orders" className="mt-10 inline-block rounded-xl bg-[#D4AF37] px-10 py-5 font-bold text-black">
          View Orders
        </Link>
      </div>
    </main>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <main className="flex min-h-screen items-center justify-center bg-black px-8 py-24 text-white">
        <p className="text-gray-400">Loading...</p>
      </main>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}