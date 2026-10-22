# Daraja Sandbox setup

IRG's M-Pesa integration is intentionally restricted to Safaricom Daraja
Sandbox. It cannot send requests to Safaricom's production API. Do not use
business merchant credentials or a personal M-Pesa transaction for development.

## Get sandbox credentials

1. Sign in at [Daraja Developers](https://developer.safaricom.co.ke/).
2. Open **My Apps** and create or select the IRG Sandbox app.
3. Add the **M-PESA Express Sandbox** product if it is not already enabled.
4. Copy the app's Consumer Key, Consumer Secret, and Passkey from the app
   details. Keep these values server-side.
5. Use the sandbox shortcode `174379` shown in the Daraja sandbox app. Use a
   test phone number from Daraja's **Test Credentials** page, not a personal
   M-Pesa number.

Daraja Sandbox credentials are not production merchant credentials. Do not
submit the Daraja **Go Live** form for sandbox development.

## Configure and run locally

1. Copy `.env.example` to `.env.local`.
2. Set `DATABASE_URL` to a development PostgreSQL database.
3. Fill in `MPESA_CONSUMER_KEY`, `MPESA_CONSUMER_SECRET`, and
   `MPESA_PASSKEY` from the sandbox app. Keep `MPESA_SHORTCODE=174379` and
   `MPESA_ENVIRONMENT=sandbox`.
4. Set `MPESA_CALLBACK_URL` to a public HTTPS URL that forwards to
   `/api/payments/mpesa/callback` on your local development server. Safaricom
   cannot call a localhost URL directly; use a trusted HTTPS tunnel and keep
   its URL in `.env.local`.
5. Install dependencies if needed, then run:

   ```sh
   npm install
   npx prisma generate
   npm run dev
   ```

6. Sign in to the site, add a product to the cart, open checkout, and use a
   phone number provided by Daraja's sandbox test credentials.

Do not commit `.env.local`, paste credentials into source code, or use
`NEXT_PUBLIC_*` names for any M-Pesa value. The checked-in `.env.example`
contains placeholders only for secrets.

## Payment behavior

- STK Push and status-query calls always use `https://sandbox.safaricom.co.ke`.
- Missing sandbox configuration returns an explicit error; requests never fall
  back to production.
- An order remains pending until a callback triggers a server-to-server Daraja
  status query. Only a query result with `ResultCode=0` marks it paid.
- A still-processing or unrecognized query result remains pending. A terminal
  nonzero numeric result marks payment failed, covering failed, cancelled, and
  timed-out sandbox attempts.
- The order confirmation page refreshes pending status for up to two minutes.
- No mock payment mode is enabled. Use Daraja's sandbox test flow for provider
  responses; sandbox tests do not charge a real M-Pesa account.

For local tests, the callback URL must remain reachable over HTTPS while the
STK Push is active. If the sandbox cannot produce a specific result, do not
pretend that a manual or browser-generated response is a Safaricom payment.

## Production

Production M-Pesa support is disabled in this codebase. The production API
hostname is not used, and setting `MPESA_ENVIRONMENT=production` causes the
integration to fail closed. Enabling production requires an explicit project
decision, a Safaricom-approved merchant account, production credentials, and
separate review and testing.
