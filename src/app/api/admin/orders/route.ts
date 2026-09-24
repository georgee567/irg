import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { serializeOrder, serializePayment } from "@/lib/serialize";

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;

  try {
    const orders = await prisma.order.findMany({
      include: {
        User: { select: { id: true, name: true, email: true } },
        OrderItem: true,
        Payment: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      orders: orders.map((order) => ({
        ...serializeOrder({ ...order, items: order.OrderItem }),
        customer: order.User,
        payments: order.Payment.map(serializePayment),
      })),
    });
  } catch (error) {
    console.error("Get admin orders error:", error);
    return NextResponse.json({ error: "Unable to fetch orders." }, { status: 500 });
  }
}
