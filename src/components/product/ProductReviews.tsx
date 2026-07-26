const reviews = [
  {
    name: "George",
    review: "Excellent quality and premium feel.",
  },
  {
    name: "Brian",
    review: "Fits perfectly. Definitely buying again.",
  },
  {
    name: "Faith",
    review: "Luxury packaging and amazing fabric.",
  },
];

export default function ProductReviews() {
  return (
    <section className="mt-32">

      <h2 className="mb-12 font-serif text-5xl">
        Customer Reviews
      </h2>

      <div className="space-y-8">

        {reviews.map((review) => (

          <div
            key={review.name}
            className="rounded-3xl border border-[#222] bg-[#090909] p-8"
          >

            <h3 className="text-xl font-semibold text-[#D4AF37]">
              {review.name}
            </h3>

            <p className="mt-4 text-gray-300">
              {review.review}
            </p>

          </div>

        ))}

      </div>

    </section>
  );
}