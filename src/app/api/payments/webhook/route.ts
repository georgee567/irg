import { NextResponse } from "next/server";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { verifyWebhookSignature } from "@/lib/payment-webhook";

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

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });

    const existingReference = await prisma.payment.findUnique({ where: { transactionReference } });
    if (existingReference?.status === "PAID") {
      return NextResponse.json({ message: "Payment was already confirmed.", transactionReference });
    }

    const payment = await prisma.payment.findFirst({
      where: { orderId, status: "PENDING" },
      orderBy: { createdAt: "desc" },
    });
    if (!payment) return NextResponse.json({ error: "No pending payment found for this order." }, { status: 409 });

    const providerResponse = JSON.parse(rawBody) as Prisma.InputJsonValue;
    if (status === "SUCCESS") {
      await prisma.$transaction([
        prisma.payment.update({
          where: { id: payment.id },
          data: { status: "PAID", transactionReference, providerResponse },
        }),
        prisma.order.update({
          where: { id: orderId },
          data: { paymentStatus: "PAID", status: order.status === "PENDING" ? "CONFIRMED" : order.status },
        }),
      ]);
      return NextResponse.json({ message: "Payment confirmed.", transactionReference });
    }

    await prisma.$transaction([
      prisma.payment.update({
        where: { id: payment.id },
        data: { status: "FAILED", transactionReference, providerResponse },
      }),
      prisma.order.update({ where: { id: orderId }, data: { paymentStatus: "FAILED" } }),
    ]);
    return NextResponse.json({ message: "Payment marked as failed.", transactionReference });
  } catch (error) {
    console.error("Payment webhook error:", error);
    return NextResponse.json({ error: "Unable to process payment webhook." }, { status: 500 });
  }
}
