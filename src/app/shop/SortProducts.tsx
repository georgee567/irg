"use client";

interface Props {
  sort: string;
  setSort: (value: string) => void;
}

export default function SortProducts({
  sort,
  setSort,
}: Props) {
  return (
    <select
      value={sort}
      onChange={(e) => setSort(e.target.value)}
      className="rounded-xl border border-[#222] bg-[#090909] px-5 py-3 text-white outline-none"
    >
      <option value="default">
        Featured
      </option>

      <option value="low">
        Price: Low → High
      </option>

      <option value="high">
        Price: High → Low
      </option>

      <option value="az">
        A → Z
      </option>
    </select>
  );
}