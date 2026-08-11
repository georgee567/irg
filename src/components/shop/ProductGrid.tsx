"use client";

import FeaturedProducts from "@/components/home/FeaturedProducts";
import ShopFilters from "@/components/shop/ShopFilters";

export default function ProductGrid() {
  return (
    <>
      <ShopFilters onCategoryChange={() => {}} />

      <FeaturedProducts />
    </>
  );
}