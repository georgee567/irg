export default function Newsletter() {
  return (
    <section className="bg-black py-32">

      <div className="mx-auto max-w-5xl px-8">

        <div className="rounded-[40px] border border-[#1d1d1d] bg-[#090909] px-12 py-20 text-center">

          <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]">
            IRG MEMBERSHIP
          </p>

          <h2 className="mt-6 font-serif text-5xl text-white md:text-6xl">
            Join The IRG Community
          </h2>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-9 text-gray-400">
            Be the first to discover exclusive collections,
            limited releases, member-only discounts and
            luxury fashion updates.
          </p>

          <div className="mx-auto mt-12 flex max-w-2xl flex-col gap-4 md:flex-row">

            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-full border border-[#222] bg-black px-7 py-4 text-white outline-none focus:border-[#D4AF37]"
            />

            <button className="rounded-full bg-[#D4AF37] px-10 py-4 font-semibold uppercase tracking-[0.2em] text-black transition hover:scale-105">
              Subscribe
            </button>

          </div>

        </div>

      </div>

    </section>
  );
}