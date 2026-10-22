/**
 * Daraja Sandbox payment processing.
 * Credentials and provider requests stay server-side.
 */

import { Prisma } from "@/generated/prisma/client";

export const MPESA_API_SANDBOX = "https://sandbox.safaricom.co.ke";

interface MpesaAccessTokenResponse {
  access_token: string;
}

interface MpesaStkPushResponse {
  ResponseCode: string;
  ResponseDescription: string;
  MerchantRequestID: string;
  CheckoutRequestID: string;
}

export interface MpesaQueryResult {
  ResultCode?: number | string;
  ResultDesc?: string;
  CallbackMetadata?: {
    Item?: Array<{ Name?: string; Value?: string | number }>;
  };
}

export type MpesaPaymentStatus = "PAID" | "FAILED" | "PENDING";

export function getMpesaQueryStatus(
  result: MpesaQueryResult,
  callbackResultCode: number | string,
): MpesaPaymentStatus {
  if (result.ResultCode === undefined || result.ResultCode === null) {
    return "PENDING";
  }

  const resultCode = String(result.ResultCode);
  if (resultCode === "0") {
    return String(callbackResultCode) === "0" ? "PAID" : "PENDING";
  }

  const description = result.ResultDesc?.toLowerCase() ?? "";
  if (
    resultCode.startsWith("500.001.") ||
    description.includes("still being processed") ||
    description.includes("request is being processed") ||
    description.includes("in progress")
  ) {
    return "PENDING";
  }

  return /^\d+$/.test(resultCode) ? "FAILED" : "PENDING";
}

function assertSandboxConfiguration() {
  if (
    process.env.MPESA_ENVIRONMENT &&
    process.env.MPESA_ENVIRONMENT !== "sandbox"
  ) {
    throw new Error(
      "Only Daraja Sandbox is enabled. Set MPESA_ENVIRONMENT=sandbox."
    );
  }

  const missing = [
    ["MPESA_CONSUMER_KEY", process.env.MPESA_CONSUMER_KEY],
    ["MPESA_CONSUMER_SECRET", process.env.MPESA_CONSUMER_SECRET],
    ["MPESA_SHORTCODE", process.env.MPESA_SHORTCODE],
    ["MPESA_PASSKEY", process.env.MPESA_PASSKEY],
    ["MPESA_CALLBACK_URL", process.env.MPESA_CALLBACK_URL],
  ]
    .filter(([, value]) => !value?.trim())
    .map(([name]) => name);

  if (missing.length > 0) {
    throw new Error(
      `Daraja Sandbox configuration is incomplete. Set ${missing.join(", ")}.`
    );
  }

  let callbackUrl: URL;
  try {
    callbackUrl = new URL(process.env.MPESA_CALLBACK_URL!);
  } catch {
    throw new Error(
      "Set MPESA_CALLBACK_URL to a valid public HTTPS callback URL."
    );
  }
  if (callbackUrl.protocol !== "https:") {
    throw new Error("MPESA_CALLBACK_URL must use HTTPS.");
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeKenyanPhoneNumber(phoneNumber: string) {
  const phone = phoneNumber.trim().replace(/[\s()-]/g, "");
  const normalized = phone.startsWith("+254")
    ? phone.slice(1)
    : phone.startsWith("0")
      ? `254${phone.slice(1)}`
      : phone;

  if (!/^254[17]\d{8}$/.test(normalized)) {
    throw new Error(
      "Enter a valid Kenyan test phone number in 07XXXXXXXX, 01XXXXXXXX, or 254XXXXXXXXX format."
    );
  }

  return normalized;
}

/**
 * Get a Daraja Sandbox access token using the selected sandbox app credentials.
 */
export async function getMpesaAccessToken(): Promise<string> {
  assertSandboxConfiguration();

  const auth = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString("base64");

  const response = await fetch(
    `${MPESA_API_SANDBOX}/oauth/v1/generate?grant_type=client_credentials`,
    {
      method: "GET",
      headers: {
        Authorization: `Basic ${auth}`,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to get Daraja Sandbox access token (HTTP ${response.status}).`
    );
  }

  const data: unknown = await response.json();
  if (
    !isRecord(data) ||
    typeof data.access_token !== "string" ||
    data.access_token.length === 0
  ) {
    throw new Error("Daraja Sandbox returned an invalid access-token response.");
  }

  const tokenResponse: MpesaAccessTokenResponse = {
    access_token: data.access_token,
  };
  return tokenResponse.access_token;
}

/**
 * Initiate an M-Pesa Express (STK Push) request against Daraja Sandbox.
 */
export async function initiateMpesaStkPush(
  phoneNumber: string,
  amount: Prisma.Decimal | string | number,
  accountReference: string,
  orderId: string
) {
  assertSandboxConfiguration();

  const accessToken = await getMpesaAccessToken();
  const amountValue = Math.round(Number(new Prisma.Decimal(amount)));
  if (!Number.isSafeInteger(amountValue) || amountValue < 1) {
    throw new Error("M-Pesa Sandbox requires a positive whole-number amount.");
  }

  const normalizedPhone = normalizeKenyanPhoneNumber(phoneNumber);
  const timestamp = new Date()
    .toISOString()
    .replace(/[^0-9]/g, "")
    .slice(0, 14);
  const shortcode = process.env.MPESA_SHORTCODE!;
  const password = Buffer.from(
    `${shortcode}${process.env.MPESA_PASSKEY}${timestamp}`
  ).toString("base64");

  const response = await fetch(
    `${MPESA_API_SANDBOX}/mpesa/stkpush/v1/processrequest`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amountValue,
        PartyA: normalizedPhone,
        PartyB: shortcode,
        PhoneNumber: normalizedPhone,
        CallBackURL: process.env.MPESA_CALLBACK_URL,
        AccountReference: accountReference.slice(0, 12),
        TransactionDesc: `IRG order ${orderId.slice(-8)}`.slice(0, 20),
      }),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to initiate Daraja Sandbox STK Push (HTTP ${response.status}).`
    );
  }

  const data: unknown = await response.json();
  if (
    !isRecord(data) ||
    typeof data.ResponseCode !== "string" ||
    typeof data.ResponseDescription !== "string" ||
    typeof data.CheckoutRequestID !== "string" ||
    typeof data.MerchantRequestID !== "string"
  ) {
    throw new Error("Daraja Sandbox returned an invalid STK Push response.");
  }

  const stkResponse: MpesaStkPushResponse = {
    ResponseCode: data.ResponseCode,
    ResponseDescription: data.ResponseDescription,
    MerchantRequestID: data.MerchantRequestID,
    CheckoutRequestID: data.CheckoutRequestID,
  };
  if (stkResponse.ResponseCode !== "0") {
    throw new Error(
      `Daraja Sandbox rejected the STK Push: ${stkResponse.ResponseDescription || "unknown provider response"}.`
    );
  }

  return {
    checkoutRequestId: stkResponse.CheckoutRequestID,
    merchantRequestId: stkResponse.MerchantRequestID,
  };
}

/**
 * Query a pending STK Push against Daraja Sandbox.
 */
export async function queryMpesaStkPushStatus(
  checkoutRequestId: string
): Promise<MpesaQueryResult> {
  assertSandboxConfiguration();

  const accessToken = await getMpesaAccessToken();
  const timestamp = new Date()
    .toISOString()
    .replace(/[^0-9]/g, "")
    .slice(0, 14);
  const shortcode = process.env.MPESA_SHORTCODE!;
  const password = Buffer.from(
    `${shortcode}${process.env.MPESA_PASSKEY}${timestamp}`
  ).toString("base64");

  const response = await fetch(
    `${MPESA_API_SANDBOX}/mpesa/stkpushquery/v1/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId,
      }),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to query Daraja Sandbox STK Push status (HTTP ${response.status}).`
    );
  }

  const data: unknown = await response.json();
  if (!isRecord(data)) {
    throw new Error("Daraja Sandbox returned an invalid STK query response.");
  }

  const result: MpesaQueryResult = {};
  if (
    typeof data.ResultCode === "number" ||
    typeof data.ResultCode === "string"
  ) {
    result.ResultCode = data.ResultCode;
  }
  if (typeof data.ResultDesc === "string") {
    result.ResultDesc = data.ResultDesc;
  }
  if (isRecord(data.CallbackMetadata) && Array.isArray(data.CallbackMetadata.Item)) {
    result.CallbackMetadata = {
      Item: data.CallbackMetadata.Item.flatMap((item: unknown) => {
        if (!isRecord(item)) return [];
        const entry: { Name?: string; Value?: string | number } = {};
        if (typeof item.Name === "string") entry.Name = item.Name;
        if (
          typeof item.Value === "string" ||
          typeof item.Value === "number"
        ) {
          entry.Value = item.Value;
        }
        return [entry];
      }),
    };
  }
  return result;
}
