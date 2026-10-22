"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  ["Dashboard", "/admin"],
  ["Products", "/admin/products"],
  ["Inventory", "/admin/inventory"],
  ["Categories", "/admin/categories"],
  ["Customers / Users", "/admin/customers"],
  ["Orders", "/admin/orders"],
  ["Reviews", "/admin/reviews"],
  ["Support", "/admin/support"],
  ["Site Content", "/admin/content"],
  ["Editorial", "/admin/editorial"],
  ["Settings", "/admin/settings"],
] as const;

export default function AdminNavigation() {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin" className="flex flex-wrap gap-2">
      {links.map(([label, href]) => {
        const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[.16em] ${active ? "border-[#D4AF37] bg-[#D4AF37] text-black" : "border-[#333] text-gray-300 hover:border-[#D4AF37]"}`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
