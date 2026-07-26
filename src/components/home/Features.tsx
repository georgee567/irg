export default function Features() {
  return (
    <section className="bg-black py-20">
      <div className="mx-auto grid max-w-7xl gap-8 px-8 md:grid-cols-4">

        {[
          ["Free Shipping", "Worldwide Delivery"],
          ["Premium Quality", "Luxury Materials"],
          ["Secure Payments", "100% Protected"],
          ["Easy Returns", "Within 14 Days"],
        ].map(([title, desc]) => (
          <div
            key={title}
            className="rounded-3xl border border-[#222] bg-[#090909] p-10 text-center transition hover:border-[#D4AF37]"
          >
            <h3 className="font-serif text-2xl text-white">
              {title}
            </h3>

            <p className="mt-4 text-gray-400">
              {desc}
            </p>
          </div>
        ))}

      </div>
    </section>
  );
}