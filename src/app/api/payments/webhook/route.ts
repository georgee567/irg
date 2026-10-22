import { NextResponse } from "next/server";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { verifyWebhookSignature } from "@/lib/payment-webhook";
import {
  failPendingOrderPayment,
  markPendingOrderPaid,
} from "@/lib/order-inventory";

type WebhookBody = {
  orderId?: unknown;
  status?: unknown;
  transactionReference?: unknown;
};

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    if (!verifyWebhookSignature(rawBody, request.headers.get("x-payment-webhook-signature"))) {
      return NextResponse.json({ error: "Unauthorized webhook request." }, { status: 401 });
    }

    const body = JSON.parse(rawBody) as WebhookBody;
    const orderId = typeof body.orderId === "string" ? body.orderId.trim() : "";
    const status = typeof body.status === "string" ? body.status.trim().toUpperCase() : "";
    const transactionReference = typeof body.transactionReference === "string" ? body.transactionReference.trim() : "";

    if (!orderId || !transactionReference || !["SUCCESS", "FAILED"].includes(status)) {
      return NextResponse.json({ error: "orderId, supported status, and transactionReference are required." }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { id: true, paymentStatus: true, status: true },
    });
    if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });
    if (order.paymentStatus !== "PENDING" || order.status === "CANCELLED") {
      return NextResponse.json({ error: "This order is no longer payable." }, { status: 409 });
    }

    const existingReference = await prisma.payment.findUnique({ where: { transactionReference } });
    if (existingReference && existingReference.orderId !== orderId) {
      return NextResponse.json({ error: "Transaction reference is already assigned to another order." }, { status: 409 });
    }
    if (existingReference?.status === "PAID" && existingReference.orderId === orderId) {
      return NextResponse.json({ message: "Payment was already confirmed.", transactionReference });
    }

    const payment = existingReference ?? await prisma.payment.findFirst({
      where: { orderId, status: "PENDING" },
      orderBy: { createdAt: "desc" },
    });
    if (!payment) return NextResponse.json({ error: "No pending payment found for this order." }, { status: 409 });
    if (payment.status !== "PENDING") {
      return NextResponse.json({ error: "This payment cannot be processed again." }, { status: 409 });
    }

    const providerResponse = JSON.parse(rawBody) as Prisma.InputJsonValue;
    if (status === "SUCCESS") {
      const result = await prisma.$transaction((transaction) =>
        markPendingOrderPaid(transaction, orderId, payment.id, {
          status: "PAID",
          transactionReference,
          providerResponse,
        }),
      );
      if (!result) {
        return NextResponse.json({ message: "Payment was already processed.", transactionReference });
      }
      return NextResponse.json({
        message: result === "INVENTORY_REVIEW"
          ? "Payment confirmed; order requires inventory review."
          : "Payment confirmed.",
        transactionReference,
        inventoryReviewRequired: result === "INVENTORY_REVIEW",
      });
    }

    await prisma.$transaction((transaction) =>
      failPendingOrderPayment(transaction, orderId, payment.id, {
        status: "FAILED",
        transactionReference,
        providerResponse,
      }),
    );
    return NextResponse.json({ message: "Payment marked as failed.", transactionReference });
  } catch (error) {
    console.error("Payment webhook error:", error);
    return NextResponse.json({ error: "Unable to process payment webhook." }, { status: 500 });
  }
}
