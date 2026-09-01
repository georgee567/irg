/**
 * PayPal Payment Processing
 * All PayPal operations are server-side to protect client secrets
 */

import { Prisma } from "@/generated/prisma/client";

export const PAYPAL_API_SANDBOX = "https://api.sandbox.paypal.com";
export const PAYPAL_API_PRODUCTION = "https://api.paypal.com";

interface PayPalAccessTokenResponse {
  access_token: string;
  app_id: string;
  scope: string;
  expires_in: number;
  token_type: string;
}

interface PayPalOrderCreateResponse {
  id: string;
  status: string;
  links: Array<{
    rel: string;
    href: string;
  }>;
}

interface PayPalOrderCaptureResponse {
  id: string;
  status: string;
  purchase_units?: Array<{
    reference_id?: string;
    payments?: {
      captures?: Array<{
        id: string;
        status: string;
        amount: {
          value: string;
          currency_code: string;
        };
      }>;
    };
  }>;
}

function getPayPalApi() {
  const mode = process.env.PAYPAL_MODE || "sandbox";
  return mode === "production" ? PAYPAL_API_PRODUCTION : PAYPAL_API_SANDBOX;
}

/**
 * Get PayPal access token using client credentials
 */
export async function getPayPalAccessToken(): Promise<string> {
  if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
    throw new Error(
      "PayPal credentials are not configured. Set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET."
    );
  }

  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const response = await fetch(`${getPayPalApi()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    throw new Error(`Failed to get PayPal access token: ${response.statusText}`);
  }

  const data = (await response.json()) as PayPalAccessTokenResponse;
  return data.access_token;
}

/**
 * Create a PayPal order
 */
export async function createPayPalOrder(
  amount: Prisma.Decimal | string | number,
  orderId: string
) {
  const accessToken = await getPayPalAccessToken();
  const amountValue = new Prisma.Decimal(amount).toFixed(2);

  const response = await fetch(`${getPayPalApi()}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: orderId,
          amount: {
            currency_code: "USD",
            value: amountValue,
          },
        },
      ],
      application_context: {
        return_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/checkout?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/checkout?cancelled=true`,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create PayPal order: ${error}`);
  }

  const data = (await response.json()) as PayPalOrderCreateResponse;
  return data;
}

/**
 * Capture a PayPal order (complete the payment)
 */
export async function capturePayPalOrder(paypalOrderId: string) {
  const accessToken = await getPayPalAccessToken();

  const response = await fetch(
    `${getPayPalApi()}/v2/checkout/orders/${paypalOrderId}/capture`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to capture PayPal order: ${error}`);
  }

  const data = (await response.json()) as PayPalOrderCaptureResponse;
  return data;
}

/**
 * Verify PayPal payment and capture order details
 */
export async function verifyPayPalPayment(paypalOrderId: string) {
  try {
    const order = await capturePayPalOrder(paypalOrderId);

    // Extract transaction ID from the capture response
    const transactionId =
      order.purchase_units?.[0]?.payments?.captures?.[0]?.id || paypalOrderId;
    const status = order.status;

    return {
      success: status === "COMPLETED",
      transactionId,
      status,
      order,
    };
  } catch (error) {
    console.error("PayPal verification error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
