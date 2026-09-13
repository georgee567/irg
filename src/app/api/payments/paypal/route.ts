import crypto from "crypto";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import {
  createPayPalOrder,
  capturePayPalOrder,
} from "@/lib/paypal";

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

    // Create PayPal order
    const paypalOrder = await createPayPalOrder(order.total, orderId);

    // Store payment record
    await prisma.payment.create({
      data: {
        id: crypto.randomUUID(),
        updatedAt: new Date(),
        Order: { connect: { id: orderId } },
        provider: "PayPal",
        method: "paypal",
        amount: order.total,
        currency: "USD",
        status: "PENDING",
        transactionReference: paypalOrder.id,
      },
    });

    // Return approval link for frontend to redirect to
    const approvalLink = paypalOrder.links.find(
      (link) => link.rel === "approve"
    );

    if (!approvalLink) {
      throw new Error("No approval link found in PayPal response");
    }

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

    // Capture the PayPal order
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
    const order = await prisma.order.findUnique({
      where: { id: referenceId },
    });

    if (!order || order.userId !== user.id) {
      return NextResponse.json(
        { error: "Order not found or unauthorized." },
        { status: 404 }
      );
    }

    // Update payment status
    await prisma.payment.updateMany({
      where: {
        orderId: referenceId,
        transactionReference: token,
      },
      data: {
        status: "PAID",
        transactionReference: transactionId,
        providerResponse: captureResult as any,
      },
    });

    // Update order payment status
    await prisma.order.update({
      where: { id: referenceId },
      data: {
        paymentStatus: "PAID",
        status: "CONFIRMED",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Payment completed successfully.",
      orderId: referenceId,
      transactionId,
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
