const categories = [
  "T-Shirts",
  "Hoodies",
  "Jackets",
  "Shoes",
  "Accessories",
  "Women",
];

export default function CategoriesPage() {
  return (
    <main className="min-h-screen bg-black text-white">

      <div className="mx-auto max-w-7xl px-8 py-24">

        <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]">
          Categories
        </p>

        <h1 className="mt-5 font-serif text-6xl">
          Browse Categories
        </h1>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {categories.map((category) => (
            <div
              key={category}
              className="rounded-3xl border border-[#222] bg-[#090909] p-12 text-center transition hover:border-[#D4AF37]"
            >
              <h2 className="text-2xl font-semibold">
                {category}
              </h2>
            </div>
          ))}

        </div>

      </div>

    </main>
  );
}