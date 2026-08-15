import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  request: Request,
  context: { params: Promise<{ orderId: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const { orderId } = await context.params;

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: user.id,
      },
      select: {
        id: true,
        status: true,
        paymentStatus: true,
        total: true,
        createdAt: true,
        payments: {
          select: {
            id: true,
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
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      orderId: order.id,
      orderStatus: order.status,
      paymentStatus: order.paymentStatus,
      total: order.total,
      payments: order.payments,
    });
  } catch (error) {
    console.error(
      "Get order payment error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to fetch order payment information.",
      },
      { status: 500 }
    );
  }
}