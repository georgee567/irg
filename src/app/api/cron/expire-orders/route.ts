import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

import { Prisma } from "@/generated/prisma/client";
import { getMpesaQueryStatus, queryMpesaStkPushStatus } from "@/lib/mpesa";
import { expirePendingOrder, markPendingOrderPaid } from "@/lib/order-inventory";
import { prisma } from "@/lib/prisma";

function isAuthorized(request: Request, secret: string) {
  const authorization = request.headers.get("authorization") ?? "";
  const supplied = authorization.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : "";
  const suppliedBuffer = Buffer.from(supplied);
  const secretBuffer = Buffer.from(secret);
  return suppliedBuffer.length === secretBuffer.length && timingSafeEqual(suppliedBuffer, secretBuffer);
}

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    console.error("CRON_SECRET is required to expire unpaid orders.");
    return NextResponse.json({ error: "Order-expiration job is not configured." }, { status: 503 });
  }
  if (!isAuthorized(request, secret)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const createdBefore = new Date(Date.now() - 30 * 60 * 1000);
    const orders = await prisma.order.findMany({
      where: {
        status: "PENDING",
        paymentStatus: "PENDING",
        createdAt: { lt: createdBefore },
      },
      orderBy: { createdAt: "asc" },
      take: 50,
      select: {
        id: true,
        Payment: {
          where: { status: "PENDING" },
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { id: true, provider: true, transactionReference: true },
        },
      },
    });

    let expired = 0;
    let confirmed = 0;
    let inventoryReview = 0;
    for (const order of orders) {
      const payment = order.Payment[0];
      if (payment?.provider === "M-Pesa" && payment.transactionReference) {
        let verified: Awaited<ReturnType<typeof queryMpesaStkPushStatus>>;
        try {
          verified = await queryMpesaStkPushStatus(payment.transactionReference);
        } catch (error) {
          console.error(`Unable to reconcile M-Pesa payment for order ${order.id}:`, error);
          continue;
        }

        const paymentStatus = getMpesaQueryStatus(verified, 0);
        if (paymentStatus === "PENDING") continue;
        if (paymentStatus === "PAID") {
          const receipt = verified.CallbackMetadata?.Item?.find(
            (item) => item.Name === "MpesaReceiptNumber",
          )?.Value;
          const updated = await prisma.$transaction((transaction) =>
            markPendingOrderPaid(transaction, order.id, payment.id, {
              status: "PAID",
              transactionReference: typeof receipt === "string"
                ? receipt
                : payment.transactionReference,
              providerResponse: verified as Prisma.InputJsonValue,
            }),
          );
          if (updated === "CONFIRMED") confirmed += 1;
          if (updated === "INVENTORY_REVIEW") inventoryReview += 1;
          continue;
        }
      }

      const released = await prisma.$transaction((transaction) =>
        expirePendingOrder(transaction, order.id, createdBefore),
      );
      if (released) expired += 1;
    }

    return NextResponse.json({ expired, confirmed, inventoryReview, checked: orders.length });
  } catch (error) {
    console.error("Expire unpaid orders error:", error);
    return NextResponse.json({ error: "Unable to expire unpaid orders." }, { status: 500 });
  }
}
