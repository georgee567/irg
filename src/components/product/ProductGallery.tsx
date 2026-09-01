"use client";

import Image from "next/image";
import { useState } from "react";
import { Product } from "@/types/models";

interface Props {
  product: Product;
}

export default function ProductGallery({
  product,
}: Props) {
  const images = product.images?.length
    ? product.images
    : ["/images/products/jacket-01.jpg"];

  const [selected, setSelected] = useState(images[0]);

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

      {images.length > 1 && (
        <div className="mt-5 grid grid-cols-4 gap-4">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelected(image)}
              className="relative h-28 overflow-hidden rounded-xl border border-[#222]"
            >
              <Image
                src={image}
                alt=""
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}