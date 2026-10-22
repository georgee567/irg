import { NextResponse } from "next/server";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { getMpesaQueryStatus, queryMpesaStkPushStatus } from "@/lib/mpesa";
import {
  failPendingOrderPayment,
  markPendingOrderPaid,
} from "@/lib/order-inventory";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export async function POST(request: Request) {
  try {
    const payload: unknown = await request.json();
    if (
      !isRecord(payload) ||
      !isRecord(payload.Body) ||
      !isRecord(payload.Body.stkCallback)
    ) {
      return NextResponse.json(
        { error: "Invalid M-Pesa callback." },
        { status: 400 }
      );
    }

    const stkCallback = payload.Body.stkCallback;
    const checkoutRequestId = stkCallback.CheckoutRequestID;
    const callbackResultCode = stkCallback.ResultCode;

    if (
      typeof checkoutRequestId !== "string" ||
      checkoutRequestId.length === 0 ||
      (typeof callbackResultCode !== "number" &&
        typeof callbackResultCode !== "string")
    ) {
      return NextResponse.json(
        { error: "Invalid M-Pesa callback." },
        { status: 400 }
      );
    }

    const payment = await prisma.payment.findFirst({
      where: {
        transactionReference: checkoutRequestId,
        status: "PENDING",
        provider: "M-Pesa",
      },
    });

    if (!payment) {
      return NextResponse.json({
        ResultCode: 0,
        ResultDesc: "Callback already processed or payment not found.",
      });
    }

    const verified = await queryMpesaStkPushStatus(checkoutRequestId);
    const queryStatus = getMpesaQueryStatus(verified, callbackResultCode);

    if (queryStatus === "PENDING") {
      await prisma.payment.updateMany({
        where: { id: payment.id, status: "PENDING" },
        data: {
          providerResponse: verified as Prisma.InputJsonValue,
        },
      });
      return NextResponse.json({
        ResultCode: 0,
        ResultDesc: "Payment is still pending confirmation.",
      });
    }

    const receipt = verified.CallbackMetadata?.Item?.find(
      (item) => item.Name === "MpesaReceiptNumber"
    )?.Value;
    const transactionReference =
      queryStatus === "PAID" && typeof receipt === "string"
        ? receipt
        : checkoutRequestId;

    if (queryStatus === "PAID") {
      const result = await prisma.$transaction((transaction) =>
        markPendingOrderPaid(transaction, payment.orderId, payment.id, {
          status: "PAID",
          transactionReference,
          providerResponse: verified as Prisma.InputJsonValue,
        }),
      );
      if (result === false) {
        return NextResponse.json({
          ResultCode: 0,
          ResultDesc: "Payment confirmation was already processed.",
        });
      }
      if (result === "INVENTORY_REVIEW") {
        return NextResponse.json({
          ResultCode: 0,
          ResultDesc: "Payment confirmed; the order requires inventory review.",
        });
      }
    } else {
      await prisma.$transaction((transaction) =>
        failPendingOrderPayment(transaction, payment.orderId, payment.id, {
          status: "FAILED",
          transactionReference,
          providerResponse: verified as Prisma.InputJsonValue,
        }),
      );
    }

    return NextResponse.json({
      ResultCode: 0,
      ResultDesc:
        queryStatus === "PAID"
          ? "Payment confirmed."
          : "Payment failed, was cancelled, or timed out.",
    });
  } catch (error) {
    console.error("M-Pesa callback error:", error);
    return NextResponse.json(
      { ResultCode: 1, ResultDesc: "Callback processing failed." },
      { status: 500 }
    );
  }
}
