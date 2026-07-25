import {
  ShieldCheck,
  Truck,
  Sparkles,
  Gem,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Premium Quality",
    text: "Crafted using carefully selected premium materials for exceptional durability.",
  },
  {
    icon: Truck,
    title: "Worldwide Shipping",
    text: "Fast and secure delivery to customers across the globe.",
  },
  {
    icon: Sparkles,
    title: "Luxury Design",
    text: "Minimalist fashion inspired by modern luxury and timeless elegance.",
  },
  {
    icon: Gem,
    title: "Exclusive Drops",
    text: "Limited edition collections available only to the IRG community.",
  },
];

export default function WhyChoose() {
  return (
    <section className="bg-black py-32">

      <div className="mx-auto max-w-7xl px-8">

        <div className="text-center">

          <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]">
            WHY IRG
          </p>

          <h2 className="mt-5 font-serif text-6xl text-white">
            Designed To Stand Out
          </h2>

        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-4">

          {features.map((feature) => {

            const Icon = feature.icon;

            return (

              <div
                key={feature.title}
                className="rounded-[28px] border border-[#1d1d1d] bg-[#090909] p-10 transition duration-300 hover:-translate-y-2 hover:border-[#D4AF37]"
              >

                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#D4AF37]/10">

                  <Icon
                    size={28}
                    className="text-[#D4AF37]"
                  />

                </div>

                <h3 className="mt-8 font-serif text-3xl text-white">
                  {feature.title}
                </h3>

                <p className="mt-5 leading-8 text-gray-400">
                  {feature.text}
                </p>

              </div>

            );
          })}

        </div>

      </div>

    </section>
  );
}