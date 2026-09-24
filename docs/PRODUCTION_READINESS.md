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
- Checkout uses server-calculated cart prices and initiates M-Pesa after order creation; payment remains pending until callback confirmation.
- PayPal capture verifies the configured conversion amount and USD currency.

## B. Security

Passwords use bcrypt. Sessions are random database-backed tokens in HTTP-only cookies. Admin authorization is enforced server-side, and customer resources are scoped to the authenticated user. Payment status is not accepted from the browser.

Remaining security work includes rate limiting for login and registration, explicit origin/CSRF protection for every cookie-authenticated mutation, provider-specific webhook signature validation where a provider supplies one, image content-signature validation/re-encoding, and formal security monitoring.

## C. Authentication

Google and Facebook routes are implemented at `/api/auth/oauth/google` and `/api/auth/oauth/facebook`. Existing users are linked by verified provider email; new users receive a random password and a normal customer role. Existing admin users retain their role. Redirects go to `/admin` for admins and `/account` for customers.

Live OAuth credentials and developer-console callback configuration are still required and have not been tested with real provider accounts.

## D. Payments

M-Pesa is the Kenya checkout path. The server creates an order from database prices, initiates an STK Push, stores a pending payment, and accepts the order as paid only after the M-Pesa callback route queries Safaricom and receives a successful result. Failed callbacks mark both payment and order failed.

PayPal remains an optional server API. It requires `PAYPAL_KES_TO_USD_RATE`, creates a USD PayPal order from the KES order total, and verifies capture amount/currency before marking paid. It is not exposed in the current checkout UI.

No card numbers, CVV values, or PINs are stored by IRG.

## E. Data Persistence

Business records are stored in PostgreSQL through Prisma. Product images are stored in Vercel Blob. The active seed command refuses to run against populated data, and normal application startup does not run seeds. Production still depends on a persistent PostgreSQL provider, persistent Blob store, and correctly configured environment variables.

## F. Image Storage

Admin image uploads go to Vercel Blob using `BLOB_READ_WRITE_TOKEN`; the resulting persistent URLs are stored in the product `images` array. No local server filesystem or base64 product storage is used.

## G. Admin

The existing admin system supports dashboard metrics, products, variants, inventory, categories, customers, orders, order status updates, and protected image uploads. Data is read from PostgreSQL.

## H. Storefront

Home, Shop, Collections, Signature Collection, product pages, cart, wishlist, account, checkout, and order history remain in the existing application. Checkout now exposes the verified M-Pesa path and reports pending payment rather than claiming success before callback confirmation.

## I. Environment Variables

Required or conditionally required variables:

- `DATABASE_URL`
- `BLOB_READ_WRITE_TOKEN`
- `AUTH_BASE_URL` or `NEXT_PUBLIC_APP_URL`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- `FACEBOOK_CLIENT_ID`, `FACEBOOK_CLIENT_SECRET`
- `MPESA_CONSUMER_KEY`, `MPESA_CONSUMER_SECRET`
- `MPESA_SHORTCODE`, `MPESA_PASSKEY`
- `MPESA_CALLBACK_URL`
- `MPESA_ENVIRONMENT` (`sandbox` or `production`)
- `PAYMENT_WEBHOOK_SECRET` for the signed generic webhook
- `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_MODE`, `PAYPAL_KES_TO_USD_RATE` if PayPal is enabled

Never expose secret variables through `NEXT_PUBLIC_*` names.

## J. External Setup

- Vercel: configure production environment variables, connect the project to the persistent PostgreSQL and Blob resources, and deploy with the repository build command.
- Database provider: use managed PostgreSQL with automated backups, point-in-time recovery where available, and run reviewed Prisma migrations during deployment.
- Google console: configure OAuth consent, production authorized origin, and callback URL `https://YOUR_DOMAIN/api/auth/oauth/google`.
- Facebook console: configure Facebook Login, the production domain, email permission, and callback URL `https://YOUR_DOMAIN/api/auth/oauth/facebook`.
- Safaricom Daraja: configure the production shortcode/passkey, callback URL, and production consumer credentials.
- Vercel Blob: create a Blob store and set `BLOB_READ_WRITE_TOKEN` in the server environment.
- PayPal: configure a live app and a reviewed KES-to-USD rate before enabling the optional API.

## K. Test Results

The latest independent checks passed:

- Prisma validation: passed.
- TypeScript: passed.
- ESLint: passed.
- Production build: passed after Prisma Client generation.

Live OAuth, Safaricom, PayPal, database failover, and object-storage recovery tests require external credentials and infrastructure access.

## L. Remaining Blockers

IRG should not yet be called fully production-ready until production credentials are configured and live payment/OAuth callbacks are tested. Rate limiting, formal CSRF/origin protection, image re-encoding, database backup verification, migration runbook testing, and safe in-place variant updates for historical orders remain recommended release work. The production database and Blob provider must also have backups/recovery policies configured outside this repository.
