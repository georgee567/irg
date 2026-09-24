import { NextResponse } from "next/server";
import { OrderStatus } from "@/generated/prisma/client";

import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

const orderStatuses = new Set<OrderStatus>([
  "PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED",
]);

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await context.params;
  try {
    const { status } = await request.json();
    if (typeof status !== "string" || !orderStatuses.has(status as OrderStatus)) {
      return NextResponse.json({ error: "Invalid order status." }, { status: 400 });
    }
    const order = await prisma.order.update({ where: { id }, data: { status: status as OrderStatus } });
    return NextResponse.json({ message: "Order status updated.", order });
  } catch (error) {
    const isMissing = typeof error === "object" && error !== null && "code" in error && error.code === "P2025";
    if (isMissing) return NextResponse.json({ error: "Order not found." }, { status: 404 });
    console.error("Update admin order error:", error);
    return NextResponse.json({ error: "Unable to update order." }, { status: 500 });
  }
}
