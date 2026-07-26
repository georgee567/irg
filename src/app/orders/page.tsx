import OrderCard from "@/components/order/OrderCard";
import { orders } from "@/data/orders";

export default function OrdersPage() {
  return (
    <main className="min-h-screen bg-black text-white">

      <div className="mx-auto max-w-7xl px-8 py-24">

        <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]">
          Orders
        </p>

        <h1 className="mt-5 font-serif text-6xl">
          Order History
        </h1>

        <div className="mt-12 space-y-8">

          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
            />
          ))}

        </div>

      </div>

    </main>
  );
}