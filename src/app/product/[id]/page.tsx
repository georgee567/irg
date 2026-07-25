"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { notFound, useParams } from "next/navigation";

import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export default function ProductPage() {
  const params = useParams();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  const id = Number(params.id);

  const product = products.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  const relatedProducts = products
    .filter(
      (p) =>
        p.category === product.category &&
        p.id !== product.id
    )
    .slice(0, 4);

  const [selectedImage, setSelectedImage] = useState(0);
  const [size, setSize] = useState("M");
  const [quantity, setQuantity] = useState(1);

  return (
    <main className="min-h-screen bg-black text-white">

      <div className="mx-auto max-w-7xl px-8 py-20">

        <div className="grid gap-20 lg:grid-cols-2">

          {/* LEFT */}

          <div>

            <div className="relative h-[720px] overflow-hidden rounded-3xl border border-[#222]">

              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover transition duration-700 hover:scale-110"
              />

            </div>

            <div className="mt-5 flex gap-4">

              {product.images.map((img, index) => (

                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative h-28 w-24 overflow-hidden rounded-xl border ${
                    selectedImage === index
                      ? "border-[#D4AF37]"
                      : "border-[#333]"
                  }`}
                >

                  <Image
                    src={img}
                    alt=""
                    fill
                    className="object-cover"
                  />

                </button>

              ))}

            </div>

          </div>

          {/* RIGHT */}

          <div>

            <p className="text-sm uppercase tracking-[0.35em] text-[#D4AF37]">
              {product.category}
            </p>

            <h1 className="mt-4 font-serif text-6xl">
              {product.name}
            </h1>

            <p className="mt-8 text-4xl font-semibold text-[#D4AF37]">
              KSh {product.price.toLocaleString()}
            </p>

            <p className="mt-8 leading-8 text-gray-400">
              {product.description}
            </p>

            <div className="mt-12">

              <h3 className="mb-4 uppercase tracking-[0.25em] text-sm">
                Size
              </h3>

              <div className="flex gap-3">

                {["S", "M", "L", "XL"].map((item) => (

                  <button
                    key={item}
                    onClick={() => setSize(item)}
                    className={`h-12 w-12 rounded-xl border transition ${
                      size === item
                        ? "border-[#D4AF37] bg-[#D4AF37] text-black"
                        : "border-[#333]"
                    }`}
                  >
                    {item}
                  </button>

                ))}

              </div>

            </div>

            <div className="mt-10 flex items-center gap-5">

              <button
                onClick={() =>
                  quantity > 1 &&
                  setQuantity(quantity - 1)
                }
                className="h-12 w-12 rounded-xl border border-[#333]"
              >
                -
              </button>

              <span className="text-2xl">
                {quantity}
              </span>

              <button
                onClick={() =>
                  setQuantity(quantity + 1)
                }
                className="h-12 w-12 rounded-xl border border-[#333]"
              >
                +
              </button>

            </div>

            <div className="mt-12 flex gap-4">

              <button
                onClick={() =>
                  addToCart({
                    id: product.id,
                    name: product.name,
                    image: product.image,
                    price: product.price,
                    quantity,
                  })
                }
                className="flex-1 rounded-xl bg-[#D4AF37] py-5 text-lg font-semibold text-black transition hover:opacity-90"
              >
                Add To Cart
              </button>

              <button
                onClick={() => addToWishlist(product)}
                className="flex h-16 w-16 items-center justify-center rounded-xl border border-[#333] transition hover:border-[#D4AF37]"
              >
                <Heart />
              </button>

            </div>

            <div className="mt-12 rounded-2xl border border-[#222] p-6">

              <p className="text-green-400">
                ✓ In Stock
              </p>

              <p className="mt-3 text-gray-400">
                Free delivery in Kenya on orders above KSh 10,000.
              </p>

              <p className="mt-3 text-gray-400">
                30-Day Easy Returns.
              </p>

            </div>

          </div>

        </div>

        <section className="mt-32">

          <h2 className="mb-10 font-serif text-4xl">
            Related Products
          </h2>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">

            {relatedProducts.map((item) => (

              <Link
                key={item.id}
                href={`/product/${item.id}`}
                className="overflow-hidden rounded-3xl border border-[#222] bg-[#090909]"
              >

                <div className="relative h-[300px]">

                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover transition duration-700 hover:scale-105"
                  />

                </div>

                <div className="p-5">

                  <h3 className="font-serif text-2xl">
                    {item.name}
                  </h3>

                  <p className="mt-3 text-[#D4AF37]">
                    KSh {item.price.toLocaleString()}
                  </p>

                </div>

              </Link>

            ))}

          </div>

        </section>

      </div>

    </main>
  );
}