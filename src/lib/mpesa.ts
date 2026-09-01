/**
 * M-Pesa Payment Processing
 * All M-Pesa operations are server-side to protect client secrets
 */

import { Prisma } from "@/generated/prisma/client";

export const MPESA_API_SANDBOX = "https://sandbox.safaricom.co.ke";
export const MPESA_API_PRODUCTION = "https://api.safaricom.co.ke";

interface MpesaAccessTokenResponse {
  access_token: string;
  expires_in: number;
}

interface MpesaStkPushResponse {
  ResponseCode: string;
  ResponseDescription: string;
  MerchantRequestID: string;
  CheckoutRequestID: string;
}

function getMpesaApi() {
  const environment = process.env.MPESA_ENVIRONMENT || "sandbox";
  return environment === "production"
    ? MPESA_API_PRODUCTION
    : MPESA_API_SANDBOX;
}

/**
 * Get M-Pesa access token using consumer credentials
 */
export async function getMpesaAccessToken(): Promise<string> {
  if (
    !process.env.MPESA_CONSUMER_KEY ||
    !process.env.MPESA_CONSUMER_SECRET
  ) {
    throw new Error(
      "M-Pesa credentials are not configured. Set MPESA_CONSUMER_KEY and MPESA_CONSUMER_SECRET."
    );
  }

  const auth = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString("base64");

  const response = await fetch(`${getMpesaApi()}/oauth/v1/generate?grant_type=client_credentials`, {
    method: "GET",
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get M-Pesa access token: ${response.statusText}`);
  }

  const data = (await response.json()) as MpesaAccessTokenResponse;
  return data.access_token;
}

/**
 * Initiate M-Pesa STK Push (prompt user to enter PIN)
 */
export async function initiateMpesaStkPush(
  phoneNumber: string,
  amount: Prisma.Decimal | string | number,
  accountReference: string,
  orderId: string
) {
  if (!process.env.MPESA_SHORTCODE || !process.env.MPESA_PASSKEY) {
    throw new Error(
      "M-Pesa configuration incomplete. Set MPESA_SHORTCODE and MPESA_PASSKEY."
    );
  }

  const accessToken = await getMpesaAccessToken();
  const amountValue = Math.round(
    Number(new Prisma.Decimal(amount))
  );

  // Normalize phone number to 2547... format
  const normalizedPhone = phoneNumber.startsWith("0")
    ? "254" + phoneNumber.slice(1)
    : phoneNumber.startsWith("+254")
      ? phoneNumber.replace("+", "")
      : "254" + phoneNumber;

  // Generate timestamp
  const timestamp = new Date()
    .toISOString()
    .replace(/[^0-9]/g, "")
    .slice(0, 14);

  // Generate password (Base64 encoded shortcode + passkey + timestamp)
  const passwordString = process.env.MPESA_SHORTCODE + process.env.MPESA_PASSKEY + timestamp;
  const password = Buffer.from(passwordString).toString("base64");

  const response = await fetch(
    `${getMpesaApi()}/mpesa/stkpush/v1/processrequest`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amountValue,
        PartyA: normalizedPhone,
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: normalizedPhone,
        CallBackURL: process.env.MPESA_CALLBACK_URL,
        AccountReference: accountReference,
        TransactionDesc: `Payment for order ${orderId}`,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to initiate M-Pesa STK Push: ${error}`);
  }

  const data = (await response.json()) as MpesaStkPushResponse;

  if (data.ResponseCode !== "0") {
    throw new Error(
      `M-Pesa error: ${data.ResponseDescription} (${data.ResponseCode})`
    );
  }

  return {
    checkoutRequestId: data.CheckoutRequestID,
    merchantRequestId: data.MerchantRequestID,
  };
}

/**
 * Query M-Pesa STK Push status
 */
export async function queryMpesaStkPushStatus(
  checkoutRequestId: string
) {
  if (!process.env.MPESA_SHORTCODE || !process.env.MPESA_PASSKEY) {
    throw new Error(
      "M-Pesa configuration incomplete. Set MPESA_SHORTCODE and MPESA_PASSKEY."
    );
  }

  const accessToken = await getMpesaAccessToken();

  // Generate timestamp
  const timestamp = new Date()
    .toISOString()
    .replace(/[^0-9]/g, "")
    .slice(0, 14);

  // Generate password
  const passwordString = process.env.MPESA_SHORTCODE + process.env.MPESA_PASSKEY + timestamp;
  const password = Buffer.from(passwordString).toString("base64");

  const response = await fetch(
    `${getMpesaApi()}/mpesa/stkpushquery/v1/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to query M-Pesa STK Push status: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}
