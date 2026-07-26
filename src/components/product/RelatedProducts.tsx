"use client";

import Image from "next/image";
import Link from "next/link";

import { products } from "@/data/products";

export default function RelatedProducts() {

  return (

    <section className="mt-32">

      <div className="mb-12 flex items-center justify-between">

        <h2 className="font-serif text-5xl">
          You May Also Like
        </h2>

        <Link
          href="/shop"
          className="text-[#D4AF37]"
        >
          View All →
        </Link>

      </div>

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">

        {products.slice(0,4).map((product)=>(

          <Link
            href={`/product/${product.id}`}
            key={product.id}
            className="overflow-hidden rounded-3xl border border-[#222]"
          >

            <div className="relative h-80">

              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover transition duration-700 hover:scale-110"
              />

            </div>

            <div className="p-6">

              <h3 className="font-serif text-2xl">
                {product.name}
              </h3>

              <p className="mt-3 text-[#D4AF37]">
                KSh {product.price.toLocaleString()}
              </p>

            </div>

          </Link>

        ))}

      </div>

    </section>

  );

}