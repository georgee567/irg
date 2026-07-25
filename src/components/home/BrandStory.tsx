import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function BrandStory() {
  return (
    <section className="bg-[#050505] py-32">

      <div className="mx-auto grid max-w-7xl items-center gap-20 px-8 lg:grid-cols-2">

        <div>

          <p className="text-xs uppercase tracking-[0.4em] text-[#D4AF37]">
            OUR STORY
          </p>

          <h2 className="mt-6 font-serif text-5xl leading-tight text-white md:text-6xl">
            Luxury Built
            <br />
            For The Next
            <br />
            Generation.
          </h2>

          <p className="mt-8 max-w-xl text-lg leading-9 text-gray-400">
            IRG is more than clothing. It represents ambition,
            confidence and identity. Every collection is crafted
            with premium materials, timeless silhouettes and a
            modern luxury aesthetic designed to stand out.
          </p>

          <Link
            href="/about"
            className="mt-10 inline-flex items-center gap-3 rounded-full border border-[#D4AF37] px-8 py-4 text-sm font-semibold uppercase tracking-[0.25em] text-[#D4AF37] transition hover:bg-[#D4AF37] hover:text-black"
          >
            Our Story

            <ArrowRight size={18} />
          </Link>

        </div>

        <div className="rounded-[40px] border border-[#1d1d1d] bg-[#090909] p-12">

          <div className="grid grid-cols-2 gap-10">

            <div>
              <h3 className="font-serif text-5xl text-[#D4AF37]">
                2026
              </h3>

              <p className="mt-2 text-gray-400">
                Founded
              </p>
            </div>

            <div>
              <h3 className="font-serif text-5xl text-[#D4AF37]">
                120+
              </h3>

              <p className="mt-2 text-gray-400">
                Products
              </p>
            </div>

            <div>
              <h3 className="font-serif text-5xl text-[#D4AF37]">
                100%
              </h3>

              <p className="mt-2 text-gray-400">
                Premium Quality
              </p>
            </div>

            <div>
              <h3 className="font-serif text-5xl text-[#D4AF37]">
                Global
              </h3>

              <p className="mt-2 text-gray-400">
                Shipping
              </p>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}