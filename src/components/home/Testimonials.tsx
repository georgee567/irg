"use client";

const reviews = [
  {
    name: "Brian M.",
    text: "Best luxury streetwear brand I've worn.",
  },
  {
    name: "Michelle A.",
    text: "Premium quality and amazing customer service.",
  },
  {
    name: "Kevin O.",
    text: "Every piece feels exclusive.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-[#050505] py-28">

      <div className="mx-auto max-w-6xl px-8">

        <div className="mb-16 text-center">

          <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]">
            Testimonials
          </p>

          <h2 className="mt-4 font-serif text-5xl text-white">
            Loved By Our Community
          </h2>

        </div>

        <div className="grid gap-8 lg:grid-cols-3">

          {reviews.map((review) => (

            <div
              key={review.name}
              className="rounded-3xl border border-[#222] bg-black p-10"
            >

              <p className="text-lg leading-8 italic text-gray-300">
                &ldquo;{review.text}&rdquo;
              </p>

              <h3 className="mt-8 font-semibold text-[#D4AF37]">
                {review.name}
              </h3>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}