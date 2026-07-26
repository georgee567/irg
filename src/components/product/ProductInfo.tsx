"use client";

import { useState } from "react";

export default function ProductInfo() {
  const [size, setSize] = useState("M");
  const [qty, setQty] = useState(1);

  return (
    <div>

      <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]">
        IRG Collection
      </p>

      <h1 className="mt-4 font-serif text-6xl">
        IRG Signature Tee
      </h1>

      <p className="mt-6 text-3xl font-bold text-[#D4AF37]">
        KSh 3,999
      </p>

      <p className="mt-8 leading-8 text-gray-400">
        Premium heavyweight cotton with oversized luxury fit,
        crafted for everyday confidence.
      </p>

      <div className="mt-10">

        <h3 className="mb-4 text-sm uppercase tracking-[0.3em]">
          Size
        </h3>

        <div className="flex gap-3">

          {["S", "M", "L", "XL"].map((item) => (
            <button
              key={item}
              onClick={() => setSize(item)}
              className={`h-12 w-12 rounded-xl border ${
                size === item
                  ? "border-[#D4AF37] bg-[#D4AF37] text-black"
                  : "border-[#222]"
              }`}
            >
              {item}
            </button>
          ))}

        </div>

      </div>

      <div className="mt-10 flex items-center gap-5">

        <button
          onClick={() => qty > 1 && setQty(qty - 1)}
          className="h-12 w-12 rounded-xl border border-[#222]"
        >
          -
        </button>

        <span className="text-2xl">
          {qty}
        </span>

        <button
          onClick={() => setQty(qty + 1)}
          className="h-12 w-12 rounded-xl border border-[#222]"
        >
          +
        </button>

      </div>

      <button className="mt-10 w-full rounded-xl bg-[#D4AF37] py-4 font-semibold text-black">
        Add To Cart
      </button>

    </div>
  );
}