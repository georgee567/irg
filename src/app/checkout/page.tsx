export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-black text-white">

      <div className="mx-auto max-w-5xl px-8 py-24">

        <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]">
          Checkout
        </p>

        <h1 className="mt-5 font-serif text-6xl">
          Secure Checkout
        </h1>

        <div className="mt-16 rounded-3xl border border-[#222] bg-[#090909] p-10">

          <p className="text-lg text-gray-400">
            Shipping details, payment methods and order confirmation
            will appear here.
          </p>

        </div>

      </div>

    </main>
  );
}