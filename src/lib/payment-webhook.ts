import crypto from "crypto";

export function verifyWebhookSignature(
  rawBody: string,
  signature: string | null
) {
  const secret = process.env.PAYMENT_WEBHOOK_SECRET;

  if (!secret || !signature) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  const received = Buffer.from(signature, "utf8");
  const expected = Buffer.from(
    expectedSignature,
    "utf8"
  );

  if (received.length !== expected.length) {
    return false;
  }

  return crypto.timingSafeEqual(
    received,
    expected
  );
}