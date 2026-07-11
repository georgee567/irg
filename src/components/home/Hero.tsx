export default function Hero() {
  return (
    <section className="relative bg-black text-white">
      <div className="mx-auto flex min-h-[85vh] max-w-7xl items-center px-8">

        {/* Left Side */}
        <div className="max-w-2xl">

          <p className="mb-6 uppercase tracking-[0.35em] text-[#D4AF37]">
            Exclusive. Timeless. IRG.
          </p>

          <h1 className="text-6xl font-serif leading-tight lg:text-8xl">
            Wear Your
            <br />
            <span className="text-[#D4AF37]">
              Identity
            </span>
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-8 text-gray-300">
            IRG is more than clothing—it's a lifestyle.
            Luxury in every stitch.
            Confidence in every move.
          </p>

          <div className="mt-12 flex gap-6">

            <button className="rounded-md bg-[#D4AF37] px-8 py-4 font-semibold text-black transition hover:opacity-90">
              Shop Collection
            </button>

            <button className="rounded-md border border-[#D4AF37] px-8 py-4 font-semibold text-[#D4AF37] transition hover:bg-[#D4AF37] hover:text-black">
              Explore Lookbook
            </button>

          </div>

        </div>

        {/* Right Side */}

        <div className="flex-1"></div>

      </div>
    </section>
  );
}