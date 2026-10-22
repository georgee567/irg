# IRG Production Readiness

## A. Completed

- Prisma schema uses database-generated UUIDs and timestamps; production builds now run `prisma generate` before `next build`.
- Seed entry points refuse populated databases and refuse production demo seeding unless `ALLOW_DEMO_SEED=true` is explicitly supplied.
- Admin pages and admin APIs use server-side role checks.
- Product uploads use Vercel Blob public URLs and are limited to image MIME types and 5 MB per file.
- Google and Facebook OAuth callback routing uses CSRF state cookies and the existing Prisma session model.
- Customer order history no longer returns provider response payloads.
- Generic payment webhooks use HMAC verification and atomic, idempotent payment/order updates.
- M-Pesa callbacks query Safaricom before marking a payment paid.
- Checkout uses server-calculated cart prices and validates stock when the order is created. Stock is deducted only after verified payment, in the same transaction that marks the order paid.
- Payment confirmation is idempotent. If a competing order consumes the last units before payment is confirmed, the paid order enters `INVENTORY_REVIEW` instead of allowing negative stock.
- PayPal capture verifies the configured conversion amount and USD currency.
- Customer reviews are limited to paid purchasers and remain unpublished until an admin approves them.
- Customer support and custom-order requests are stored for admin follow-up.
- Dashboard analytics are calculated from database orders, customers, products, and reviews; Lookbook and Journal entries are database-backed and editable by admins.

## B. Security

Passwords use bcrypt. Sessions are random database-backed tokens in HTTP-only cookies. Admin authorization is enforced server-side, and customer resources are scoped to the authenticated user. Payment status is not accepted from the browser.

Remaining security work includes rate limiting for login, registration, public support submissions, and reviews; explicit origin/CSRF protection for every cookie-authenticated mutation; provider-specific webhook signature validation where a provider supplies one; image content-signature validation/re-encoding; and formal security monitoring.

## C. Authentication

Google and Facebook routes are implemented at `/api/auth/oauth/google` and `/api/auth/oauth/facebook`. Existing users are linked by verified provider email; new users receive a random password and a normal customer role. Existing admin users retain their role. Redirects go to `/admin` for admins and `/account` for customers.

Live OAuth credentials and developer-console callback configuration are still required and have not been tested with real provider accounts.

## D. Payments

M-Pesa is currently restricted to Daraja Sandbox for development and testing. The server creates an order from database prices, initiates a sandbox STK Push, and accepts the order as paid only after a server-side status query confirms success. Pending provider responses remain pending; terminal failures, cancellations, and timeouts mark the payment failed. Production M-Pesa is intentionally disabled until explicitly approved and configured.

PayPal remains an optional server API. It requires `PAYPAL_KES_TO_USD_RATE`, creates a USD PayPal order from the KES order total, and verifies capture amount/currency before marking paid. It is not exposed in the current checkout UI.

Order creation validates stock but does not reserve or deduct it. Once a provider verifies payment, IRG atomically deducts the purchased quantities and marks the order paid. Duplicate confirmations do not deduct stock again. If stock is no longer available at confirmation time, the order enters `INVENTORY_REVIEW` for an admin to resolve after replenishment. Paid orders cannot be cancelled through the admin status flow because automated refunds are not implemented; any required refund must be handled with the payment provider. Unpaid orders expire after 30 minutes through the scheduled cleanup and the next checkout. The Vercel cron job uses `CRON_SECRET`.

No card numbers, CVV values, or PINs are stored by IRG.

## E. Data Persistence

Business records, verified product reviews, and customer support requests are stored in PostgreSQL through Prisma. Product images are stored in Vercel Blob. The active seed command refuses to run against populated data, and normal application startup does not run seeds. Production still depends on a persistent PostgreSQL provider, persistent Blob store, and correctly configured environment variables.

## F. Image Storage

Admin image uploads go to Vercel Blob using `BLOB_READ_WRITE_TOKEN`; the resulting persistent URLs are stored in the product `images` array. No local server filesystem or base64 product storage is used.

## G. Admin

The existing admin system supports database-backed dashboard metrics and trends, products, variants, inventory, categories, customers, orders, order status updates, protected image uploads, FAQ/page-content editing, Lookbook and Journal publishing, customer-review moderation, and support-request triage. Data is read from PostgreSQL.

## H. Storefront

Home, Shop, Collections, product pages, cart, wishlist, account, checkout, FAQ, Lookbook, Custom, Journal, About, and order history are available. Shop products and categories, homepage featured products and collection categories, editorial content, and product/category filters use production database records. Dashboard analytics and homepage counters use actual records rather than seeded display values. Approved customer reviews supply both product reviews and homepage testimonials. Contact and custom-order forms save requests for admin follow-up.

## I. Environment Variables

Required or conditionally required variables:

- `DATABASE_URL`
- `BLOB_READ_WRITE_TOKEN`
- `AUTH_BASE_URL` or `NEXT_PUBLIC_APP_URL`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- `FACEBOOK_CLIENT_ID`, `FACEBOOK_CLIENT_SECRET`
- `MPESA_CONSUMER_KEY`, `MPESA_CONSUMER_SECRET` (Daraja Sandbox app only)
- `MPESA_SHORTCODE` (`174379` for the Daraja Sandbox app)
- `MPESA_PASSKEY` (from the Daraja Sandbox app)
- `MPESA_CALLBACK_URL` (public HTTPS callback URL)
- `MPESA_ENVIRONMENT=sandbox`
- `PAYMENT_WEBHOOK_SECRET` for the signed generic webhook
- `CRON_SECRET` for the Vercel unpaid-order cleanup job
- `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_MODE`, `PAYPAL_KES_TO_USD_RATE` if PayPal is enabled

Never expose secret variables through `NEXT_PUBLIC_*` names.

## J. External Setup

- Vercel: configure production environment variables for the application, connect the project to the persistent PostgreSQL and Blob resources, set `CRON_SECRET`, and deploy with the repository build command. The Vercel Production M-Pesa integration must remain Sandbox until Daraja Go Live is approved and production credentials are supplied.
- Database provider: use managed PostgreSQL with automated backups, point-in-time recovery where available, and run reviewed Prisma migrations during deployment.
- Google console: configure OAuth consent, production authorized origin, and callback URL `https://YOUR_DOMAIN/api/auth/oauth/google`.
- Facebook console: configure Facebook Login, the production domain, email permission, and callback URL `https://YOUR_DOMAIN/api/auth/oauth/facebook`.
- Safaricom Daraja sandbox setup and local test instructions are in [MPESA_SANDBOX_SETUP.md](./MPESA_SANDBOX_SETUP.md). Daraja Go Live and production credentials are out of scope until explicitly approved.
- Vercel Blob: create a Blob store and set `BLOB_READ_WRITE_TOKEN` in the server environment.
- PayPal: configure a live app and a reviewed KES-to-USD rate before enabling the optional API.
- Support notifications: messages are available in the protected admin dashboard; configure an email provider if automatic email notifications are required.

## K. Test Results

The following local checks passed for the current changes:

- `npx prisma validate`
- `npx tsc --noEmit` and TypeScript validation during the Next.js production build
- `npm run lint`
- `npx next build`, using a non-routable test `DATABASE_URL` and without applying migrations
- `git diff --check` (Git reported only existing LF-to-CRLF working-copy warnings)

The repository `build` script runs `prisma migrate deploy` before generating Prisma Client and building Next.js; do not use it as a local build check against a production-configured `DATABASE_URL`. Do not apply the new migrations to production until they have been reviewed and deployment is approved. Database-backed payment, inventory-race, and editorial integration tests were not run because no test database or provider credentials were configured.

Live OAuth, Safaricom, PayPal, database failover, and object-storage recovery tests require external credentials and infrastructure access.

## L. Remaining Blockers

IRG should not yet be called fully production-ready. M-Pesa production payments are intentionally disabled; only Daraja Sandbox is supported for testing, so real live-payment verification requires Safaricom Go Live approval and production credentials. The generic signed payment webhook also requires `PAYMENT_WEBHOOK_SECRET` in Vercel Production. Live OAuth, PayPal, database failover, email notifications, and object-storage recovery tests require external credentials and infrastructure access. Rate limiting, formal CSRF/origin protection, image re-encoding, database backup verification, migration runbook testing, and safe in-place variant updates for historical orders remain recommended release work. The production database and Blob provider must also have backups/recovery policies configured outside this repository.
