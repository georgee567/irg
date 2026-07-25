"use client";

import { useState } from "react";

interface Props {
  onCategoryChange: (category: string) => void;
}

const categories = [
  "All",
  "Hoodies",
  "T-Shirts",
  "Sneakers",
  "Jackets",
  "Accessories",
];

export default function ShopFilters({
  onCategoryChange,
}: Props) {
  const [active, setActive] = useState("All");

  function change(category: string) {
    setActive(category);
    onCategoryChange(category);
  }

  return (
    <div className="mb-12 flex flex-wrap gap-4">

      {categories.map((category) => (

        <button
          key={category}
          onClick={() => change(category)}
          className={`rounded-full px-6 py-3 transition ${
            active === category
              ? "bg-[#D4AF37] text-black"
              : "border border-[#222] bg-[#090909] text-white hover:border-[#D4AF37]"
          }`}
        >
          {category}
        </button>

      ))}

    </div>
  );
}