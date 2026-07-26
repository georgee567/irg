export default function CartPage() {
  return (
    <main className="min-h-screen bg-black text-white">

      <div className="mx-auto max-w-7xl px-8 py-24">

        <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]">
          Shopping Cart
        </p>

        <h1 className="mt-5 font-serif text-6xl">
          Your Cart
        </h1>

        <div className="mt-16 grid gap-10 lg:grid-cols-[2fr_1fr]">

          <div className="rounded-3xl border border-[#222] bg-[#090909] p-10">

            <h2 className="text-2xl font-semibold">
              Cart Items
            </h2>

            <p className="mt-6 text-gray-400">
              Your selected products will appear here.
            </p>

          </div>

          <div className="rounded-3xl border border-[#222] bg-[#090909] p-10">

            <h2 className="text-2xl font-semibold">
              Order Summary
            </h2>

            <div className="mt-8 flex justify-between">
              <span>Subtotal</span>
              <span>KSh 0</span>
            </div>

            <div className="mt-4 flex justify-between">
              <span>Shipping</span>
              <span>Free</span>
            </div>

            <div className="mt-8 border-t border-[#222] pt-6 flex justify-between text-xl font-bold">
              <span>Total</span>
              <span className="text-[#D4AF37]">
                KSh 0
              </span>
            </div>

            <button className="mt-8 w-full rounded-xl bg-[#D4AF37] py-4 font-semibold text-black">
              Proceed to Checkout
            </button>

          </div>

        </div>

      </div>

    </main>
  );
}