import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-8 text-white">

      <div className="text-center">

        <h1 className="font-serif text-8xl text-[#D4AF37]">
          404
        </h1>

        <p className="mt-6 text-2xl">
          Page Not Found
        </p>

        <Link
          href="/"
          className="mt-10 inline-block rounded-xl bg-[#D4AF37] px-8 py-4 font-semibold text-black"
        >
          Back Home
        </Link>

      </div>

    </main>
  );
}