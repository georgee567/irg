"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useAuth } from "@/context/AuthContext";
import { Order } from "@/types/models";

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const response = await fetch("/api/orders", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (!response.ok) {
          if (response.status === 401) {
            setOrders([]);
            return;
          }
          throw new Error("Unable to load orders.");
        }

        const data = await response.json();
        setOrders(data.orders ?? []);
      } catch (error) {
        console.error("Load orders error:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      loadOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

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

        {loading ? (
          <p className="mt-16 text-gray-400">Loading your orders...</p>
        ) : orders.length === 0 ? (
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
                    <p className="mt-2 text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    <p className="mt-2 text-sm uppercase tracking-[0.25em] text-[#D4AF37]">
                      {order.paymentStatus}
                    </p>
                  </div>

                  <div className="text-left lg:text-right">
                    <p className="text-[#D4AF37]">{order.status}</p>
                    <p className="mt-2 text-xl font-semibold">
                      KSh {Number(order.total).toLocaleString()}
                    </p>
                  </div>
                </div>

                {order.items?.length ? (
                  <div className="mt-6 border-t border-[#222] pt-6">
                    <p className="text-sm uppercase tracking-[0.25em] text-gray-500">Items</p>
                    <ul className="mt-3 space-y-2 text-gray-400">
                      {order.items.map((item) => (
                        <li key={item.id} className="flex justify-between gap-4">
                          <span>
                            {item.productName} ({item.size}, {item.color})
                          </span>
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