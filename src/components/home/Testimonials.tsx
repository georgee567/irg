"use client";

import type { SiteContent } from "@/lib/site-content";

type TestimonialReview = {
  id: string;
  rating: number;
  text: string;
  name: string;
};

export default function Testimonials({
  content,
  reviews,
}: {
  content: SiteContent;
  reviews: TestimonialReview[];
}) {
  return (
    <section className="bg-[#050505] py-28">

      <div className="mx-auto max-w-6xl px-8">

        <div className="mb-16 text-center">

          <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]">
            {content.testimonialsEyebrow}
          </p>

          <h2 className="mt-4 font-serif text-5xl text-white">
            {content.testimonialsTitle}
          </h2>

        </div>

        <div className="grid gap-8 lg:grid-cols-3">

          {reviews.map((review) => (

            <div
              key={review.id}
              className="rounded-3xl border border-[#222] bg-black p-10"
            >

              <p className="mb-4 text-[#D4AF37]" aria-label={`${review.rating} out of 5 stars`}>
                {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
              </p>

              <p className="text-lg leading-8 italic text-gray-300">
                &ldquo;{review.text}&rdquo;
              </p>

              <h3 className="mt-8 font-semibold text-[#D4AF37]">
                {review.name}
              </h3>

            </div>

          ))}

        </div>
        {reviews.length === 0 ? (
          <p className="mt-8 text-center text-gray-400">
            Verified customer reviews will appear here as customers share their experiences.
          </p>
        ) : null}

      </div>

    </section>
  );
}