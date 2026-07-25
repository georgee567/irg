import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Brian Mwangi",
    role: "Nairobi",
    review:
      "IRG completely changed how I dress. The quality is premium and every piece feels luxurious.",
  },
  {
    name: "Faith Wanjiku",
    role: "Mombasa",
    review:
      "Beautiful craftsmanship, elegant designs and excellent customer service. Worth every shilling.",
  },
  {
    name: "Kevin Otieno",
    role: "Kisumu",
    review:
      "The attention to detail is incredible. IRG feels like an international luxury brand.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-[#050505] py-32">

      <div className="mx-auto max-w-7xl px-8">

        <div className="text-center">

          <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]">
            Testimonials
          </p>

          <h2 className="mt-5 font-serif text-6xl text-white">
            Loved Worldwide
          </h2>

        </div>

        <div className="mt-20 grid gap-8 lg:grid-cols-3">

          {testimonials.map((item) => (

            <div
              key={item.name}
              className="rounded-[30px] border border-[#1d1d1d] bg-black p-10 transition duration-300 hover:border-[#D4AF37]"
            >

              <div className="mb-8 flex gap-1">

                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className="fill-[#D4AF37] text-[#D4AF37]"
                  />
                ))}

              </div>

              <p className="leading-9 text-gray-300">
                "{item.review}"
              </p>

              <div className="mt-10">

                <h3 className="font-serif text-2xl text-white">
                  {item.name}
                </h3>

                <p className="mt-2 text-sm uppercase tracking-[0.3em] text-[#D4AF37]">
                  {item.role}
                </p>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}