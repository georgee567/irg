"use client";

interface Props {
  category: string;
  setCategory: (value: string) => void;
  categories: Array<{ id: string; name: string; slug: string }>;
}

export default function CategoryFilter({
  category,
  setCategory,
  categories,
}: Props) {
  return (
    <div className="mb-10 flex flex-wrap gap-4">
      {[
        { name: "All", value: "All" },
        ...categories.map((item) => ({ name: item.name, value: item.slug })),
      ].map((item) => (
        <button
          key={item.value}
          onClick={() => setCategory(item.value)}
          className={`rounded-full border px-6 py-3 transition ${
            category === item.value
              ? "border-[#D4AF37] bg-[#D4AF37] text-black"
              : "border-[#222] text-white hover:border-[#D4AF37]"
          }`}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
}