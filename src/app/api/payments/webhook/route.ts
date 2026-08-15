import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

const WEBHOOK_SECRET = process.env.PAYMENT_WEBHOOK_SECRET;

export async function POST(request: Request) {
  try {
    if (!WEBHOOK_SECRET) {
      console.error("PAYMENT_WEBHOOK_SECRET is not configured.");

      return NextResponse.json(
        { error: "Payment webhook is not configured." },
        { status: 500 }
      );
    }

    const providedSecret =
      request.headers.get("x-payment-webhook-secret");

    if (!providedSecret || providedSecret !== WEBHOOK_SECRET) {
      return NextResponse.json(
        { error: "Unauthorized webhook request." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const orderId =
      typeof body.orderId === "string"
        ? body.orderId.trim()
        : "";

    const status =
      typeof body.status === "string"
        ? body.status.trim().toUpperCase()
        : "";

    const transactionReference =
      typeof body.transactionReference === "string"
        ? body.transactionReference.trim()
        : "";

    if (!orderId || !status || !transactionReference) {
      return NextResponse.json(
        {
          error:
            "orderId, status and transactionReference are required.",
        },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found." },
        { status: 404 }
      );
    }

    if (status === "SUCCESS") {
      const payment = await prisma.payment.findFirst({
        where: {
          orderId,
          status: "PENDING",
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (!payment) {
        return NextResponse.json(
          {
            error: "No pending payment found for this order.",
          },
          { status: 409 }
        );
      }

      const updatedOrder = await prisma.$transaction(
        async (tx) => {
          await tx.payment.update({
            where: {
              id: payment.id,
            },
            data: {
              status: "PAID",
              transactionReference,
              providerResponse: body,
            },
          });

          return tx.order.update({
            where: {
              id: orderId,
            },
            data: {
              paymentStatus: "PAID",
              status:
                order.status === "PENDING"
                  ? "CONFIRMED"
                  : order.status,
            },
          });
        }
      );

      return NextResponse.json({
        message: "Payment confirmed.",
        transactionReference,
        order: updatedOrder,
      });
    }

    if (status === "FAILED") {
      const payment = await prisma.payment.findFirst({
        where: {
          orderId,
          status: "PENDING",
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (!payment) {
        return NextResponse.json(
          {
            error: "No pending payment found for this order.",
          },
          { status: 409 }
        );
      }

      const updatedPayment = await prisma.payment.update({
        where: {
          id: payment.id,
        },
        data: {
          status: "FAILED",
          transactionReference,
          providerResponse: body,
        },
      });

      await prisma.order.update({
        where: {
          id: orderId,
        },
        data: {
          paymentStatus: "FAILED",
        },
      });

      return NextResponse.json({
        message: "Payment marked as failed.",
        transactionReference,
        payment: updatedPayment,
      });
    }

    return NextResponse.json(
      {
        error: "Unsupported payment status.",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Payment webhook error:", error);

    return NextResponse.json(
      {
        error: "Unable to process payment webhook.",
      },
      { status: 500 }
    );
  }
}