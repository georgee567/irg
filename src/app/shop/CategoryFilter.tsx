"use client";

interface Props {
  category: string;
  setCategory: (value: string) => void;
}

const categories = [
  "All",
  "Hoodies",
  "T-Shirts",
  "Pants",
  "Jackets",
];

export default function CategoryFilter({
  category,
  setCategory,
}: Props) {
  return (
    <div className="mb-10 flex flex-wrap gap-4">

      {categories.map((item) => (

        <button
          key={item}
          onClick={() => setCategory(item)}
          className={`rounded-full border px-6 py-3 transition

          ${
            category === item
              ? "border-[#D4AF37] bg-[#D4AF37] text-black"
              : "border-[#222] text-white hover:border-[#D4AF37]"
          }`}
        >
          {item}
        </button>

      ))}

    </div>
  );
}
