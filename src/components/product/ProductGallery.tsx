"use client";

import Image from "next/image";
import { useState } from "react";
import { Product } from "@/data/products";

interface Props {
  product: Product;
}

export default function ProductGallery({
  product,
}: Props) {

  const [selected, setSelected] =
    useState(product.image);

  return (

    <div>

      <div className="relative h-[700px] overflow-hidden rounded-3xl border border-[#222]">

        <Image
          src={selected}
          alt={product.name}
          fill
          className="object-cover"
        />

      </div>

      <div className="mt-5 grid grid-cols-4 gap-4">

        {[1,2,3,4].map((item)=>(

          <button
            key={item}
            onClick={()=>setSelected(product.image)}
            className="relative h-28 overflow-hidden rounded-xl border border-[#222]"
          >

            <Image
              src={product.image}
              alt=""
              fill
              className="object-cover"
            />

          </button>

        ))}

      </div>

    </div>

  );

}