import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const collections = [
  {
    title: "Men",
    subtitle: "Luxury Streetwear",
    image: "/images/hero-model.png",
  },
  {
    title: "Women",
    subtitle: "Premium Fashion",
    image: "/images/hero-model.png",
  },
  {
    title: "Accessories",
    subtitle: "Complete Your Style",
    image: "/images/hero-model.png",
  },
];

export default function Collections() {
  return (
    <section className="bg-black py-32">

      <div className="mx-auto max-w-7xl px-8">

        <div className="mb-16 text-center">

          <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]">
            Collections
          </p>

          <h2 className="mt-5 font-serif text-6xl text-white">
            Discover IRG
          </h2>

        </div>

        <div className="grid gap-8 lg:grid-cols-3">

          {collections.map((collection) => (

            <div
              key={collection.title}
              className="group relative h-[600px] overflow-hidden rounded-[35px]"
            >

              <Image
                src={collection.image}
                alt={collection.title}
                fill
                className="object-cover transition duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

              <div className="absolute bottom-0 left-0 p-10">

                <p className="text-sm uppercase tracking-[0.35em] text-[#D4AF37]">
                  {collection.subtitle}
                </p>

                <h3 className="mt-4 font-serif text-5xl text-white">
                  {collection.title}
                </h3>

                <Link
                  href="/shop"
                  className="mt-8 inline-flex items-center gap-3 rounded-full border border-[#D4AF37] px-7 py-3 text-sm uppercase tracking-[0.2em] text-[#D4AF37] transition hover:bg-[#D4AF37] hover:text-black"
                >
                  Shop Collection

                  <ArrowRight size={17} />
                </Link>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}