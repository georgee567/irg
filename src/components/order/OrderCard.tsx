"use client";

import { Order } from "@/types/models";

interface Props {
  order: Order;
}

export default function OrderCard({ order }: Props) {
  return (
    <div className="rounded-3xl border border-[#222] bg-[#090909] p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl text-white">
            {order.id}
          </h2>

          <p className="mt-2 text-gray-400">
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>

        <span className="rounded-full bg-[#D4AF37]/20 px-5 py-2 text-sm text-[#D4AF37]">
          {order.status}
        </span>
      </div>

      <div className="mt-8 space-y-5">
        {order.items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-5"
          >
            <div className="flex-1">
              <h3 className="font-medium">
                {item.productName}
              </h3>

              <p className="text-gray-400">
                {item.size} / {item.color} · Qty: {item.quantity}
              </p>
            </div>

            <p className="font-semibold text-[#D4AF37]">
              KSh {Number(item.lineTotal).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 border-t border-[#222] pt-6 flex justify-between text-xl">
        <span>Total</span>

        <span className="font-bold text-[#D4AF37]">
          KSh {Number(order.total).toLocaleString()}
        </span>
      </div>
    </div>
  );
}