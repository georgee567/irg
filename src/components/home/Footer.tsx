import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#1d1d1d] bg-[#050505]">

      <div className="mx-auto max-w-7xl px-8 py-24">

        <div className="grid gap-16 lg:grid-cols-4">

          <div>

            <h2 className="font-serif text-5xl tracking-[0.25em] text-[#D4AF37]">
              IRG
            </h2>

            <p className="mt-8 max-w-sm leading-8 text-gray-400">
              Luxury streetwear designed for people who lead with
              confidence, creativity and individuality.
            </p>

          </div>

          <div>

            <h3 className="mb-6 text-sm uppercase tracking-[0.35em] text-[#D4AF37]">
              Shop
            </h3>

            <div className="flex flex-col gap-4 text-gray-400">

              <Link href="/shop">New Arrivals</Link>

              <Link href="/collections">Collections</Link>

              <Link href="/shop">Men</Link>

              <Link href="/shop">Women</Link>

              <Link href="/shop">Accessories</Link>

            </div>

          </div>

          <div>

            <h3 className="mb-6 text-sm uppercase tracking-[0.35em] text-[#D4AF37]">
              Support
            </h3>

            <div className="flex flex-col gap-4 text-gray-400">

              <Link href="/contact">Contact</Link>

              <Link href="/orders">Track Order</Link>

              <Link href="/about">About IRG</Link>

              <Link href="/">Privacy Policy</Link>

              <Link href="/">Terms & Conditions</Link>

            </div>

          </div>

          <div>

            <h3 className="mb-6 text-sm uppercase tracking-[0.35em] text-[#D4AF37]">
              Stay Connected
            </h3>

            <p className="mb-6 leading-8 text-gray-400">
              Subscribe for exclusive drops, offers and early access.
            </p>

            <div className="flex">

              <input
                type="email"
                placeholder="Email Address"
                className="flex-1 rounded-l-full border border-[#222] bg-black px-5 py-3 text-white outline-none focus:border-[#D4AF37]"
              />

              <button className="rounded-r-full bg-[#D4AF37] px-6 font-semibold text-black">
                Join
              </button>

            </div>

          </div>

        </div>

        <div className="mt-20 flex flex-col items-center justify-between gap-6 border-t border-[#1d1d1d] pt-10 text-sm text-gray-500 md:flex-row">

          <p>
            © 2026 IRG. All Rights Reserved.
          </p>

          <div className="flex gap-8">

            <Link href="/">Instagram</Link>

            <Link href="/">TikTok</Link>

            <Link href="/">Facebook</Link>

            <Link href="/">X</Link>

          </div>

        </div>

      </div>

    </footer>
  );
}