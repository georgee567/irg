import crypto from "crypto";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { initiateMpesaStkPush } from "@/lib/mpesa";

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

    // Initiate M-Pesa STK Push
    const stkPush = await initiateMpesaStkPush(
      phoneNumber,
      order.total,
      order.shippingName,
      orderId
    );

    // Store payment record
    const payment = await prisma.payment.create({
      data: {
    id: crypto.randomUUID(),
    updatedAt: new Date(),
    Order: { connect: { id: orderId } },
    provider: "M-Pesa",
        method: "mpesa",
        amount: order.total,
        currency: "KES",
        status: "PENDING",
        transactionReference: stkPush.checkoutRequestId,
        providerResponse: {
          merchantRequestId: stkPush.merchantRequestId,
          checkoutRequestId: stkPush.checkoutRequestId,
        } as any,
      },
    });

    return NextResponse.json({
      success: true,
      message: "STK Push sent. Please enter your M-Pesa PIN.",
      payment,
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
