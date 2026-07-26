"use client";

import { useEffect, useState } from "react";

export default function PageLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
  setLoading(false);
}, 50);

    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black">

      <div className="text-center">

        <h1 className="font-serif text-7xl tracking-[0.25em] text-[#D4AF37]">
          IRG
        </h1>

        <div className="mx-auto mt-10 h-[2px] w-56 overflow-hidden rounded-full bg-[#1b1b1b]">

          <div className="h-full w-full animate-pulse bg-[#D4AF37]" />

        </div>

        <p className="mt-8 text-xs uppercase tracking-[0.45em] text-gray-500">
          Loading Luxury...
        </p>

      </div>

    </div>
  );
}