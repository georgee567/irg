import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { queryMpesaStkPushStatus } from "@/lib/mpesa";

type MpesaCallback = {
  Body?: {
    stkCallback?: {
      CheckoutRequestID?: unknown;
      ResultCode?: unknown;
      ResultDesc?: unknown;
    };
  };
};

type MpesaQueryResult = {
  ResultCode?: number | string;
  ResultDesc?: string;
  CallbackMetadata?: {
    Item?: Array<{ Name?: string; Value?: string | number }>;
  };
};

export async function POST(request: Request) {
  try {
    const callback = (await request.json()) as MpesaCallback;
    const stkCallback = callback.Body?.stkCallback;
    const checkoutRequestId = typeof stkCallback?.CheckoutRequestID === "string" ? stkCallback.CheckoutRequestID : "";
    if (!checkoutRequestId) return NextResponse.json({ error: "Invalid M-Pesa callback." }, { status: 400 });

    const verified = (await queryMpesaStkPushStatus(checkoutRequestId)) as MpesaQueryResult;
    const payment = await prisma.payment.findFirst({
      where: { transactionReference: checkoutRequestId, status: "PENDING", provider: "M-Pesa" },
    });
    if (!payment) return NextResponse.json({ ResultCode: 0, ResultDesc: "Callback already processed or payment not found." });

    const resultCode = Number(verified.ResultCode);
    const receipt = verified.CallbackMetadata?.Item?.find((item) => item.Name === "MpesaReceiptNumber")?.Value;
    const transactionReference = typeof receipt === "string" ? receipt : checkoutRequestId;

    if (resultCode === 0) {
      await prisma.$transaction([
        prisma.payment.update({
          where: { id: payment.id },
          data: { status: "PAID", transactionReference, providerResponse: verified },
        }),
        prisma.order.update({
          where: { id: payment.orderId },
          data: { paymentStatus: "PAID", status: "CONFIRMED" },
        }),
      ]);
    } else {
      await prisma.$transaction([
        prisma.payment.update({
          where: { id: payment.id },
          data: { status: "FAILED", providerResponse: verified },
        }),
        prisma.order.update({ where: { id: payment.orderId }, data: { paymentStatus: "FAILED" } }),
      ]);
    }

    return NextResponse.json({ ResultCode: 0, ResultDesc: verified.ResultDesc || "Accepted" });
  } catch (error) {
    console.error("M-Pesa callback error:", error);
    return NextResponse.json({ ResultCode: 1, ResultDesc: "Callback processing failed." }, { status: 500 });
  }
}
