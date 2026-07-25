import OrderCard from "@/components/order/OrderCard";
import { orders } from "@/data/orders";

export default function OrdersPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-8 py-20">
        <h1 className="mb-10 font-serif text-5xl">
          My Orders
        </h1>

        <div className="space-y-6">
          {orders.map((order: any) => (
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