"use client";

import { useEffect, useState } from "react";

interface Order {

  id:string;

  date:string;

  status:string;

  total:number;

}

export default function OrdersPage(){

  const [orders,setOrders]=useState<Order[]>([]);

  useEffect(()=>{

    const saved=JSON.parse(
      localStorage.getItem("irg-orders")||"[]"
    );

    setOrders(saved);

  },[]);

  return(

    <main className="min-h-screen bg-black text-white">

      <div className="mx-auto max-w-7xl px-8 py-24">

        <h1 className="font-serif text-6xl">

          My Orders

        </h1>

        <div className="mt-16 space-y-8">

          {orders.map(order=>(

            <div
              key={order.id}
              className="rounded-3xl border border-[#222] bg-[#090909] p-8"
            >

              <div className="flex justify-between">

                <div>

                  <h2 className="text-2xl">

                    {order.id}

                  </h2>

                  <p className="mt-2 text-gray-400">

                    {order.date}

                  </p>

                </div>

                <div className="text-right">

                  <p className="text-[#D4AF37]">

                    {order.status}

                  </p>

                  <p className="mt-2">

                    KSh {order.total.toLocaleString()}

                  </p>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </main>

  );

}