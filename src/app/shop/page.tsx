"use client";

import { useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { products } from "@/data/products";

import { useCart } from "@/context/CartContext";
import { useSearch } from "@/context/SearchContext";

import SearchBar from "@/components/shop/SearchBar";
import CategoryFilter from "@/components/shop/CategoryFilter";
import SortProducts from "@/components/shop/SortProducts";

export default function ShopPage() {

  const { addToCart } = useCart();

  const { search } = useSearch();

  const [category, setCategory] = useState("All");

  const [sort, setSort] = useState("default");

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

  if (sort === "low") {

    filtered.sort((a, b) => a.price - b.price);

  }

  if (sort === "high") {

    filtered.sort((a, b) => b.price - a.price);

  }

  if (sort === "az") {

    filtered.sort((a, b) =>
      a.name.localeCompare(b.name)
    );

  }

  return (

    <main className="min-h-screen bg-black text-white">

      <div className="mx-auto max-w-7xl px-8 py-24">

        <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]">
          Luxury Collection
        </p>

        <h1 className="mt-5 font-serif text-6xl">
          Shop
        </h1>

        <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

          <SearchBar />

          <SortProducts
            sort={sort}
            setSort={setSort}
          />

        </div>

        <CategoryFilter
          category={category}
          setCategory={setCategory}
        />

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">

          {filtered.map((product) => (

            <div
              key={product.id}
              className="overflow-hidden rounded-3xl border border-[#222] bg-[#090909]"
            >

              <Link href={`/product/${product.id}`}>

                <div className="relative h-80">

                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition duration-700 hover:scale-110"
                  />

                </div>

              </Link>

              <div className="p-6">

                <h2 className="font-serif text-2xl">
                  {product.name}
                </h2>

                <p className="mt-4 text-[#D4AF37]">
                  KSh {product.price.toLocaleString()}
                </p>

                <button
                  onClick={() =>
                    addToCart({
                      id: product.id,
                      name: product.name,
                      image: product.image,
                      price: product.price,
                      quantity: 1,
                    })
                  }
                  className="mt-6 w-full rounded-xl bg-[#D4AF37] py-3 font-semibold text-black transition hover:opacity-90"
                >
                  Add To Cart
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

    </main>

  );
}