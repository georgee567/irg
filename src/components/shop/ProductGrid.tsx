"use client";

import { useState } from "react";

import { products } from "@/data/products";
import { useSearch } from "@/context/SearchContext";

import FeaturedProducts from "@/components/home/FeaturedProducts";
import ShopFilters from "../../app/shop/ShopFilters";

export default function ProductGrid() {
  const { search } = useSearch();

  const [category, setCategory] = useState("All");

  const filtered = products.filter((product) => {
    const matchesSearch =
      product.name
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" ||
      product.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <ShopFilters
        onCategoryChange={setCategory}
      />

      <FeaturedProducts />
    </>
  );
}