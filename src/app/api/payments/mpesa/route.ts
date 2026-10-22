import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { initiateMpesaStkPush } from "@/lib/mpesa";
import { expirePendingOrder, failPendingOrderPayment } from "@/lib/order-inventory";

/**
 * POST /api/payments/mpesa
 * Initiate M-Pesa STK Push payment
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
    const phoneNumber =
      typeof body.phoneNumber === "string"
        ? body.phoneNumber.trim()
        : "";

    if (!orderId || !phoneNumber) {
      return NextResponse.json(
        { error: "orderId and phoneNumber are required." },
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
    if (order.status === "CANCELLED") {
      return NextResponse.json(
        { error: "Cancelled orders cannot be paid." },
        { status: 409 }
      );
    }

    const existingPayment = await prisma.payment.findFirst({
      where: {
        orderId,
        provider: "M-Pesa",
        status: "PENDING",
      },
      orderBy: { createdAt: "desc" },
    });

    const expiresAt = new Date(Date.now() - 30 * 60 * 1000);
    if (order.createdAt < expiresAt) {
      if (existingPayment?.provider === "M-Pesa" && existingPayment.transactionReference) {
        return NextResponse.json(
          { error: "This payment is still being checked by the provider. Please refresh your order status." },
          { status: 409 },
        );
      }
      await prisma.$transaction((transaction) =>
        expirePendingOrder(transaction, orderId, expiresAt),
      );
      return NextResponse.json(
        { error: "This unpaid order expired. Please place a new order." },
        { status: 409 },
      );
    }

    if (existingPayment?.transactionReference) {
      return NextResponse.json(
        { error: "An M-Pesa payment is already awaiting confirmation for this order." },
        { status: 409 },
      );
    }

    const payment =
      existingPayment ??
      (await prisma.payment.create({
        data: {
          orderId,
          provider: "M-Pesa",
          method: "mpesa",
          amount: order.total,
          currency: "KES",
          status: "PENDING",
        },
      }));

    let stkPush: Awaited<ReturnType<typeof initiateMpesaStkPush>>;
    try {
      stkPush = await initiateMpesaStkPush(
        phoneNumber,
        order.total,
        `IRG${orderId.slice(-9)}`,
        orderId
      );
    } catch (error) {
      await prisma.$transaction((transaction) =>
        failPendingOrderPayment(transaction, orderId, payment.id, {
          provider: "M-Pesa",
          method: "mpesa",
          status: "FAILED",
        }),
      );
      throw error;
    }

    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        provider: "M-Pesa",
        method: "mpesa",
        transactionReference: stkPush.checkoutRequestId,
        providerResponse: {
          merchantRequestId: stkPush.merchantRequestId,
          checkoutRequestId: stkPush.checkoutRequestId,
        },
      },
    });

    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });
    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }

    return NextResponse.json({
      success: true,
      message: "Sandbox STK Push sent. Use the Daraja test flow to complete it.",
      payment: {
        id: payment.id,
        status: payment.status,
        transactionReference: stkPush.checkoutRequestId,
      },
      checkoutRequestId: stkPush.checkoutRequestId,
    });
  } catch (error) {
    console.error("Initiate M-Pesa payment error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Unable to initiate M-Pesa payment.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
