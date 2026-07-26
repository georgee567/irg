import FeaturedProducts from "@/components/home/FeaturedProducts";

export default function WishlistPage() {
  return (
    <main className="min-h-screen bg-black text-white">

      <div className="mx-auto max-w-7xl px-8 py-24">

        <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]">
          Wishlist
        </p>

        <h1 className="mt-5 font-serif text-6xl">
          Saved Items
        </h1>

        <div className="mt-16">

          <FeaturedProducts />

        </div>

      </div>

    </main>
  );
}