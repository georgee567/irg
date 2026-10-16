import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | IRG",
  description: "How IRG handles account, order, and sign-in information.",
};

const sectionClass = "mt-10";
const headingClass = "font-serif text-2xl text-white";
const paragraphClass = "mt-4 leading-8 text-gray-300";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black px-8 py-24 text-white">
      <article className="mx-auto max-w-4xl">
        <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]">
          Draft for IRG review
        </p>
        <h1 className="mt-5 font-serif text-5xl">Privacy Policy</h1>
        <p className={paragraphClass}>
          This draft describes the information handled by the IRG online store.
          IRG should review and approve it before relying on it as a final legal
          policy. Last updated: October 16, 2026.
        </p>

        <section className={sectionClass}>
          <h2 className={headingClass}>Information we handle</h2>
          <p className={paragraphClass}>
            When you create an account, IRG stores your name and email address
            and a securely hashed password. If you choose Google or Facebook
            sign-in, the sign-in provider returns your name and email address
            to create or find your IRG account. IRG does not receive your
            provider password.
          </p>
          <p className={paragraphClass}>
            To process an order, IRG stores the contact and delivery details you
            submit, the products and quantities ordered, and order and payment
            status information. Cart and wishlist contents are also stored for
            your account. IRG does not store payment card numbers, security
            codes, or M-Pesa PINs.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>How we use information</h2>
          <p className={paragraphClass}>
            Information is used to provide account access, maintain carts and
            wishlists, process and support orders, communicate about orders,
            and protect the store and its customers. We do not sell personal
            information.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>Service providers and sign-in</h2>
          <p className={paragraphClass}>
            IRG uses hosting and storage providers to operate the website and
            store its database and product images. If you choose social
            sign-in, Google or Meta processes that sign-in under its own
            privacy terms. The M-Pesa integration is currently connected to
            Safaricom&apos;s Daraja Sandbox for testing; it is not a live
            payment service.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>Cookies and retention</h2>
          <p className={paragraphClass}>
            IRG uses an HTTP-only session cookie to keep you signed in. Sign-in
            state used during an OAuth redirect is temporary. Account, cart,
            and order records are retained while needed to provide the service
            and manage transactions, subject to applicable legal requirements.
            Sign-in sessions expire after seven days.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>Your requests and contact</h2>
          <p className={paragraphClass}>
            You can ask IRG to access, correct, or delete personal information
            by contacting{" "}
            <a className="text-[#D4AF37] underline" href="mailto:info@irg.com">
              info@irg.com
            </a>
            . We may need to verify your identity and retain information where
            required to manage an order or meet legal obligations.
          </p>
        </section>
      </article>
    </main>
  );
}
