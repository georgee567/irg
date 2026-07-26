"use client";

import { useState } from "react";
import Image from "next/image";

const images = [
  "/images/hero-model.png",
  "/images/hero-model.png",
  "/images/hero-model.png",
  "/images/hero-model.png",
];

export default function ProductGallery() {
  const [selected, setSelected] = useState(images[0]);

  return (
    <div className="flex gap-6">

      <div className="flex flex-col gap-4">

        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelected(image)}
            className={`relative h-24 w-24 overflow-hidden rounded-2xl border ${
              selected === image
                ? "border-[#D4AF37]"
                : "border-[#222]"
            }`}
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

      <div className="relative aspect-square flex-1 overflow-hidden rounded-3xl border border-[#222]">

        <Image
          src={selected}
          alt=""
          fill
          className="object-cover"
        />

      </div>

    </div>
  );
}
