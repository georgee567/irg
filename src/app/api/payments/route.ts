import crypto from "crypto";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const payments = await prisma.payment.findMany({
      where: {
      Order: {
          userId: user.id,
        },
      },
      select: {
        id: true,
        orderId: true,
        provider: true,
        method: true,
        transactionReference: true,
        amount: true,
        currency: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      payments,
    });
  } catch (error) {
    console.error("Get payments error:", error);

    return NextResponse.json(
      { error: "Unable to fetch payment information." },
      { status: 500 }
    );
  }
}

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
      typeof body.orderId === "string"
        ? body.orderId.trim()
        : "";

    const provider =
      typeof body.provider === "string"
        ? body.provider.trim()
        : "";

    const method =
      typeof body.method === "string"
        ? body.method.trim()
        : "";

    if (!orderId || !provider || !method) {
      return NextResponse.json(
        {
          error:
            "orderId, provider and method are required.",
        },
        { status: 400 }
      );
    }

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

    const existingPayment =
      await prisma.payment.findFirst({
        where: {
          orderId,
          status: "PENDING",
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    const payment = existingPayment
      ? await prisma.payment.update({
          where: {
            id: existingPayment.id,
          },
          data: {
            provider,
            method,
          },
        })
      : await prisma.payment.create({
          data: {
          id: crypto.randomUUID(),
          updatedAt: new Date(),
              Order: { connect: { id: orderId } },
    provider,
    method,            amount: order.total,
            currency: "KES",
            status: "PENDING",
          },
        });

    return NextResponse.json({
      message: "Payment initiated.",
      payment,
    });
  } catch (error) {
    console.error(
      "Initiate payment error:",
      error
    );

    return NextResponse.json(
      { error: "Unable to initiate payment." },
      { status: 500 }
    );
  }
}