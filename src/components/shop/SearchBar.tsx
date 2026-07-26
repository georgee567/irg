"use client";

import { Search } from "lucide-react";
import { useSearch } from "@/context/SearchContext";

export default function SearchBar() {

  const {
    search,
    setSearch,
  } = useSearch();

  return (

    <div className="relative mb-12">

      <Search
        size={18}
        className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500"
      />

      <input
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        placeholder="Search luxury products..."
        className="w-full rounded-full border border-[#222] bg-[#090909] py-4 pl-14 pr-6 text-white outline-none focus:border-[#D4AF37]"
      />

    </div>

  );

}