"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useAuth } from "@/context/AuthContext";

interface Order {
  id: string;
  date: string;
  status: string;
  payment: string;
  paymentStatus?: string;
  total: number;
  subtotal?: number;
  shipping?: number;
  tax?: number;
  discount?: number;
  items?: Array<{ name: string; quantity: number }>;
}

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Load orders from localStorage after hydration
    const saved = JSON.parse(localStorage.getItem("irg-orders") || "[]") as Order[];
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrders(saved);
  }, []);

  if (!user) {
    return (
      <main className="min-h-screen bg-black px-8 py-24 text-white">
        <div className="mx-auto max-w-4xl rounded-[32px] border border-[#222] bg-[#090909] p-10 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]">Orders</p>
          <h1 className="mt-5 font-serif text-5xl">Sign in to view your orders</h1>
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
        <h1 className="font-serif text-6xl">My Orders</h1>

        {orders.length === 0 ? (
          <div className="mt-16 rounded-[32px] border border-[#222] bg-[#090909] p-10 text-center">
            <p className="text-gray-400">No orders yet. Start by shopping the collection.</p>
            <Link href="/shop" className="mt-8 inline-block rounded-xl bg-[#D4AF37] px-8 py-4 font-semibold text-black">
              Browse Shop
            </Link>
          </div>
        ) : (
          <div className="mt-16 space-y-8">
            {orders.map((order) => (
              <div key={order.id} className="rounded-3xl border border-[#222] bg-[#090909] p-8">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h2 className="text-2xl">{order.id}</h2>
                    <p className="mt-2 text-gray-400">{order.date}</p>
                    <p className="mt-2 text-sm uppercase tracking-[0.25em] text-[#D4AF37]">{order.payment}</p>
                    {order.paymentStatus ? <p className="mt-2 text-sm text-gray-400">Payment: {order.paymentStatus}</p> : null}
                  </div>

                  <div className="text-left lg:text-right">
                    <p className="text-[#D4AF37]">{order.status}</p>
                    <p className="mt-2 text-xl font-semibold">KSh {order.total.toLocaleString()}</p>
                  </div>
                </div>

                {order.items?.length ? (
                  <div className="mt-6 border-t border-[#222] pt-6">
                    <p className="text-sm uppercase tracking-[0.25em] text-gray-500">Items</p>
                    <ul className="mt-3 space-y-2 text-gray-400">
                      {order.items.map((item, index) => (
                        <li key={`${order.id}-${index}`} className="flex justify-between gap-4">
                          <span>{item.name}</span>
                          <span>Qty {item.quantity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}