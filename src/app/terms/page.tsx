import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | IRG",
  description: "Terms for using the IRG online store.",
};

const sectionClass = "mt-10";
const headingClass = "font-serif text-2xl text-white";
const paragraphClass = "mt-4 leading-8 text-gray-300";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-black px-8 py-24 text-white">
      <article className="mx-auto max-w-4xl">
        <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]">
          Draft for IRG review
        </p>
        <h1 className="mt-5 font-serif text-5xl">Terms of Service</h1>
        <p className={paragraphClass}>
          This draft covers use of the IRG online store. IRG should review and
          approve it before relying on it as a final legal agreement. Last
          updated: October 16, 2026.
        </p>

        <section className={sectionClass}>
          <h2 className={headingClass}>Using the store</h2>
          <p className={paragraphClass}>
            Use the store lawfully and provide accurate account, contact, and
            delivery information. Keep your sign-in details secure and contact
            IRG if you believe your account has been used without permission.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>Orders and payment</h2>
          <p className={paragraphClass}>
            Product availability, pricing, delivery options, and order details
            are shown on the store and at checkout. An order is not marked paid
            until the relevant payment provider confirms it. The M-Pesa option
            currently uses Safaricom Daraja Sandbox for testing only; it does
            not collect real M-Pesa funds and must not be used with a personal
            M-Pesa number.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>Store content and availability</h2>
          <p className={paragraphClass}>
            IRG makes reasonable efforts to keep product details and the store
            available, but listings and site features may change. If an order
            or product detail needs attention, contact IRG before relying on
            it.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>Contact</h2>
          <p className={paragraphClass}>
            Questions about these terms can be sent to{" "}
            <a className="text-[#D4AF37] underline" href="mailto:info@irg.com">
              info@irg.com
            </a>
            .
          </p>
        </section>
      </article>
    </main>
  );
}
