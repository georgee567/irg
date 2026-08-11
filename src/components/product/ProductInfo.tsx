"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

interface Props {
  product: Product;
}

const sizes = ["XS", "S", "M", "L", "XL"];
const colours = ["Black", "White", "Grey", "Brown"];

export default function ProductInfo({ product }: Props) {
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  const [selectedSize, setSelectedSize] = useState("M");
  const [colour, setColour] = useState("Black");
  const [quantity, setQuantity] = useState(1);

  return (
    <div>
      <p className="uppercase tracking-[0.35em] text-[#D4AF37]">{product.category}</p>
      <h1 className="mt-5 font-serif text-6xl">{product.name}</h1>
      <p className="mt-6 text-3xl text-[#D4AF37]">KSh {product.price.toLocaleString()}</p>
      <p className="mt-8 leading-8 text-gray-400">{product.description}</p>

      <div className="mt-10">
        <h3 className="mb-4 font-semibold">Size</h3>
        <div className="flex flex-wrap gap-3">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`rounded-lg border px-5 py-3 transition ${
                selectedSize === size ? "border-[#D4AF37] bg-[#D4AF37] text-black" : "border-[#333] text-white"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <h3 className="mb-4 font-semibold">Colour</h3>
        <div className="flex flex-wrap gap-3">
          {colours.map((item) => (
            <button
              key={item}
              onClick={() => setColour(item)}
              className={`rounded-lg border px-5 py-3 transition ${
                colour === item ? "border-[#D4AF37] bg-[#D4AF37] text-black" : "border-[#333] text-white"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 flex items-center gap-4">
        <button onClick={() => quantity > 1 && setQuantity(quantity - 1)} className="h-12 w-12 rounded-lg border border-[#333]">
          -
        </button>
        <span className="text-xl">{quantity}</span>
        <button onClick={() => setQuantity(quantity + 1)} className="h-12 w-12 rounded-lg border border-[#333]">
          +
        </button>
      </div>

      <button
        onClick={() =>
          addToCart({
            id: product.id,
            name: `${product.name} (${selectedSize}, ${colour})`,
            image: product.image,
            price: product.price,
            quantity,
          })
        }
        className="mt-10 w-full rounded-xl bg-[#D4AF37] py-5 font-bold text-black"
      >
        Add To Cart
      </button>

      <button
        onClick={() =>
          addToWishlist({
            id: product.id,
            name: product.name,
            image: product.image,
            price: product.price,
          })
        }
        className="mt-5 flex items-center gap-3 text-gray-300 transition hover:text-[#D4AF37]"
      >
        <Heart size={20} />
        Add To Wishlist
      </button>
    </div>
  );
}