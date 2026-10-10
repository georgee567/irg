import Link from "next/link";
import { getSiteContent } from "@/lib/site-content";

export default async function Footer() {
  const content = await getSiteContent("footer");
  return (
    <footer className="border-t border-[#1b1b1b] bg-black">

      <div className="mx-auto grid max-w-7xl gap-12 px-8 py-20 md:grid-cols-4">

        <div>

          <h2 className="font-serif text-5xl tracking-[0.25em] text-[#D4AF37]">
            IRG
          </h2>

          <p className="mt-6 leading-8 text-gray-400">
            {content.description}
          </p>

        </div>

        <div>

          <h3 className="mb-6 font-semibold uppercase tracking-[0.25em] text-white">
            {content.shopHeading}
          </h3>

          <div className="space-y-3 text-gray-400">

            <Link href="/shop?category=men" className="block hover:text-[#D4AF37]">{content.menLabel}</Link>
            <Link href="/shop?category=women" className="block hover:text-[#D4AF37]">{content.womenLabel}</Link>
            <Link href="/shop?category=accessories" className="block hover:text-[#D4AF37]">{content.accessoriesLabel}</Link>

          </div>

        </div>

        <div>

          <h3 className="mb-6 font-semibold uppercase tracking-[0.25em] text-white">
            {content.companyHeading}
          </h3>

          <div className="space-y-3 text-gray-400">

            <Link href="/about" className="block hover:text-[#D4AF37]">{content.aboutLabel}</Link>
            <Link href="/journal" className="block hover:text-[#D4AF37]">{content.journalLabel}</Link>
            <Link href="/contact" className="block hover:text-[#D4AF37]">{content.contactLabel}</Link>

          </div>

        </div>

        <div>

          <h3 className="mb-6 font-semibold uppercase tracking-[0.25em] text-white">
            {content.contactHeading}
          </h3>

          <div className="space-y-3 text-gray-400">

            <p>{content.country}</p>
            <p>{content.email}</p>
            <p>{content.phoneOne}</p>
            <p>{content.phoneTwo}</p>

          </div>

        </div>

      </div>

      <div className="border-t border-[#191919] py-6 text-center text-sm text-gray-500">
        {content.copyright}
      </div>

    </footer>
  );
}