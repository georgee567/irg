export default function AccountPage() {
  return (
    <main className="min-h-screen bg-black text-white">

      <div className="mx-auto max-w-7xl px-8 py-24">

        <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]">
          My Account
        </p>

        <h1 className="mt-5 font-serif text-6xl">
          Dashboard
        </h1>

        <div className="mt-12 grid gap-8 md:grid-cols-3">

          <div className="rounded-3xl border border-[#222] bg-[#090909] p-8">
            <h2 className="text-2xl">Orders</h2>
          </div>

          <div className="rounded-3xl border border-[#222] bg-[#090909] p-8">
            <h2 className="text-2xl">Wishlist</h2>
          </div>

          <div className="rounded-3xl border border-[#222] bg-[#090909] p-8">
            <h2 className="text-2xl">Profile</h2>
          </div>

        </div>

      </div>

    </main>
  );
}