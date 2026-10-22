import { NextResponse } from "next/server";
import { OrderStatus } from "@/generated/prisma/client";

import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import {
  deductOrderInventory,
  releaseOrderInventory,
} from "@/lib/order-inventory";

const orderStatuses = new Set<OrderStatus>([
  "PENDING", "CONFIRMED", "INVENTORY_REVIEW", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED",
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
    const order = await prisma.$transaction(async (transaction) => {
      const current = await transaction.order.findUnique({
        where: { id },
        select: { paymentStatus: true, status: true },
      });
      if (!current) return null;

      if (status === "CANCELLED" && current.paymentStatus === "PAID") {
        return { error: "Paid orders require a refund before they can be cancelled." as const };
      }
      if (status === "INVENTORY_REVIEW" && current.status !== "INVENTORY_REVIEW") {
        return { error: "Inventory review is assigned automatically after a payment cannot be fulfilled." as const };
      }
      if (
        status !== "PENDING" &&
        status !== "CANCELLED" &&
        current.paymentStatus !== "PAID"
      ) {
        return { error: "Only paid orders can be confirmed or fulfilled." as const };
      }
      if (
        current.status === "INVENTORY_REVIEW" &&
        (status === "PENDING" || status === "CANCELLED")
      ) {
        return { error: "Resolve the inventory issue before changing this paid order." as const };
      }

      if (status === "CANCELLED" && current.paymentStatus === "PENDING") {
        const cancelled = await transaction.order.updateMany({
          where: { id, paymentStatus: "PENDING", status: { not: "CANCELLED" } },
          data: { status: "CANCELLED", paymentStatus: "FAILED" },
        });
        if (cancelled.count === 1) {
          await transaction.payment.updateMany({
            where: { orderId: id, status: "PENDING" },
            data: { status: "FAILED" },
          });
          await releaseOrderInventory(transaction, id);
        }
      } else {
        if (current.status === "INVENTORY_REVIEW" && status !== "INVENTORY_REVIEW") {
          const inventoryDeducted = await deductOrderInventory(transaction, id);
          if (!inventoryDeducted) {
            return { error: "Insufficient stock to release this order from inventory review." as const };
          }
        }
        await transaction.order.update({
          where: { id },
          data: { status: status as OrderStatus },
        });
      }
      return { order: await transaction.order.findUnique({ where: { id } }) };
    });
    if (order && "error" in order) {
      return NextResponse.json({ error: order.error }, { status: 409 });
    }
    if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });
    return NextResponse.json({ message: "Order status updated.", order: order.order });
  } catch (error) {
    const isMissing = typeof error === "object" && error !== null && "code" in error && error.code === "P2025";
    if (isMissing) return NextResponse.json({ error: "Order not found." }, { status: 404 });
    console.error("Update admin order error:", error);
    return NextResponse.json({ error: "Unable to update order." }, { status: 500 });
  }
}
