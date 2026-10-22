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
  const images = product.images ?? [];

  const [selected, setSelected] = useState(images[0] ?? "");

  return (
    <div>
      <div className="relative h-[700px] overflow-hidden rounded-3xl border border-[#222]">
        {selected ? (
          <Image
            src={selected}
            alt={product.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-[#111] text-sm text-gray-500">
            Product images have not been added yet.
          </div>
        )}
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