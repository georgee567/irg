import Link from "next/link";

export default function OrderSuccessPage() {

  return (

    <main className="flex min-h-screen items-center justify-center bg-black text-white">

      <div className="text-center">

        <h1 className="font-serif text-7xl text-[#D4AF37]">

          Thank You

        </h1>

        <p className="mt-8 text-xl text-gray-400">

          Your order has been placed successfully.

        </p>

        <Link
          href="/orders"
          className="mt-12 inline-block rounded-xl bg-[#D4AF37] px-10 py-5 font-bold text-black"
        >
          View Orders
        </Link>

      </div>

    </main>

  );

}