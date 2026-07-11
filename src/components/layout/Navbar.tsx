import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-black border-b border-gray-800">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-8">
        <Link
          href="/"
          className="text-3xl font-bold tracking-[0.3em] text-[#D4AF37]"
        >
          IRG
        </Link>

        <ul className="hidden gap-8 lg:flex text-white">
          <li><Link href="/">Home</Link></li>
          <li><Link href="#">Collections</Link></li>
          <li><Link href="#">Shop</Link></li>
          <li><Link href="#">About</Link></li>
          <li><Link href="#">Contact</Link></li>
        </ul>

        <div className="flex items-center gap-5 text-white">
          <span>Search</span>
          <span>Account</span>
          <span>Bag</span>

          <button className="rounded border border-[#D4AF37] px-4 py-2 text-[#D4AF37]">
            JOIN IRG
          </button>
        </div>
      </div>
    </nav>
  );
}