"use client";

import { useState } from "react";

interface Props {
  onApply: (discount: number) => void;
}

export default function PromoCode({
  onApply,
}: Props) {

  const [code, setCode] = useState("");

  function applyCode() {

    if (code.toUpperCase() === "IRG10") {

      onApply(10);

      alert("Promo code applied!");

    } else {

      alert("Invalid promo code");

    }

  }

  return (

    <div className="mt-10">

      <h2 className="mb-4 text-2xl font-serif">
        Promo Code
      </h2>

      <div className="flex gap-4">

        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter promo code"
          className="flex-1 rounded-xl border border-[#222] bg-[#090909] p-4"
        />

        <button
          onClick={applyCode}
          className="rounded-xl bg-[#D4AF37] px-8 font-semibold text-black"
        >
          Apply
        </button>

      </div>

    </div>

  );

}