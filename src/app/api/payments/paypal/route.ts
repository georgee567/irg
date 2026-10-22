import crypto from "crypto";
import { NextResponse } from "next/server";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import {
  createPayPalOrder,
  capturePayPalOrder,
  getPayPalAmount,
} from "@/lib/paypal";
import { markPendingOrderPaid } from "@/lib/order-inventory";

/**
 * POST /api/payments/paypal
 * Create a PayPal order for checkout
 */
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const orderId =
      typeof body.orderId === "string" ? body.orderId.trim() : "";

    if (!orderId) {
      return NextResponse.json(
        { error: "orderId is required." },
        { status: 400 }
      );
    }

    // Verify order belongs to user
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: user.id,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found." },
        { status: 404 }
      );
    }

    if (order.paymentStatus === "PAID") {
      return NextResponse.json(
        { error: "This order has already been paid." },
        { status: 409 }
      );
    }
    if (order.status === "CANCELLED" || order.paymentStatus !== "PENDING") {
      return NextResponse.json(
        { error: "This order is no longer payable." },
        { status: 409 }
      );
    }
    const pendingPayment = await prisma.payment.findFirst({
      where: { orderId, status: "PENDING" },
      select: { id: true },
    });
    if (pendingPayment) {
      return NextResponse.json(
        { error: "A payment is already pending for this order." },
        { status: 409 }
      );
    }

    // Create PayPal order
    const paypalOrder = await createPayPalOrder(order.total, orderId);
    const approvalLink = paypalOrder.links.find(
      (link) => link.rel === "approve"
    );

    if (!approvalLink) {
      throw new Error("No approval link found in PayPal response");
    }

    // Store payment record
    await prisma.payment.create({
      data: {
        id: crypto.randomUUID(),
        updatedAt: new Date(),
        Order: { connect: { id: orderId } },
        provider: "PayPal",
        method: "paypal",
        amount: getPayPalAmount(order.total),
        currency: "USD",
        status: "PENDING",
        transactionReference: paypalOrder.id,
      },
    });

    return NextResponse.json({
      paypalOrderId: paypalOrder.id,
      approvalUrl: approvalLink.href,
    });
  } catch (error) {
    console.error("Create PayPal order error:", error);

    const message =
      error instanceof Error ? error.message : "Unable to create PayPal order.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * GET /api/payments/paypal/capture?token=EC-xxx
 * Capture a PayPal payment after user approval
 */
export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "PayPal token is required." },
        { status: 400 }
      );
    }

    const payment = await prisma.payment.findUnique({
      where: { transactionReference: token },
      include: {
        Order: {
          select: {
            id: true,
            userId: true,
            status: true,
            paymentStatus: true,
            total: true,
          },
        },
      },
    });

    if (!payment || payment.provider !== "PayPal" || payment.Order.userId !== user.id) {
      return NextResponse.json(
        { error: "PayPal payment not found." },
        { status: 404 }
      );
    }
    if (payment.status === "PAID") {
      return NextResponse.json({
        success: true,
        message: "Payment was already completed.",
        orderId: payment.orderId,
        transactionId: token,
      });
    }
    if (
      payment.status !== "PENDING" ||
      payment.Order.paymentStatus !== "PENDING" ||
      payment.Order.status === "CANCELLED"
    ) {
      return NextResponse.json(
        { error: "This PayPal payment is no longer payable." },
        { status: 409 }
      );
    }

    const captureResult = await capturePayPalOrder(token);

    if (captureResult.status !== "COMPLETED") {
      return NextResponse.json(
        {
          error: "PayPal payment was not completed.",
          status: captureResult.status,
        },
        { status: 400 }
      );
    }

    // Extract reference ID (our order ID) from purchase units
    const referenceId = captureResult.purchase_units?.[0]?.reference_id;

    if (!referenceId) {
      throw new Error("No reference ID in PayPal capture response");
    }

    // Get the transaction ID
    const transactionId =
      captureResult.purchase_units?.[0]?.payments?.captures?.[0]?.id ||
      token;

    // Update order and payment in database
    if (referenceId !== payment.orderId) {
      return NextResponse.json(
        { error: "PayPal order reference did not match the pending payment." },
        { status: 400 }
      );
    }

    const capture = captureResult.purchase_units?.[0]?.payments?.captures?.[0];
    if (!capture || capture.status !== "COMPLETED" || capture.amount.currency_code !== "USD" || !new Prisma.Decimal(capture.amount.value).eq(getPayPalAmount(payment.Order.total))) {
      return NextResponse.json({ error: "PayPal capture amount or currency did not match the order." }, { status: 400 });
    }

    const paymentUpdated = await prisma.$transaction((transaction) =>
      markPendingOrderPaid(transaction, payment.orderId, payment.id, {
        status: "PAID",
        providerResponse: JSON.parse(JSON.stringify(captureResult)) as Prisma.InputJsonValue,
      }),
    );
    if (!paymentUpdated) {
      return NextResponse.json({ error: "No pending PayPal payment found for this order." }, { status: 409 });
    }

    return NextResponse.json({
      success: true,
      message: paymentUpdated === "INVENTORY_REVIEW"
        ? "Payment completed. The order needs inventory review."
        : "Payment completed successfully.",
      orderId: payment.orderId,
      transactionId,
      inventoryReviewRequired: paymentUpdated === "INVENTORY_REVIEW",
    });
  } catch (error) {
    console.error("Capture PayPal payment error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Unable to capture PayPal payment.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
