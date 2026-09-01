"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

import { Product } from "@/types/models";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";

interface Props {
  product: Product;
}

export default function ProductInfo({ product }: Props) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, wishlist } = useWishlist();
  const { user } = useAuth();

  const [selectedSize, setSelectedSize] = useState(
    product.variants?.[0]?.size ?? ""
  );
  const [colour, setColour] = useState(
    product.variants?.[0]?.color ?? ""
  );
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState("");

  const availableSizes = Array.from(
    new Set(
      (product.variants ?? [])
        .filter((variant) => variant.stock > 0)
        .map((variant) => variant.size)
    )
  );

  const availableColours = Array.from(
    new Set(
      (product.variants ?? [])
        .filter((variant) => variant.stock > 0)
        .map((variant) => variant.color)
    )
  );

  const isInWishlist = wishlist.some(
    (item) => item.productId === product.id
  );

  function findVariant() {
    if (selectedSize && colour) {
      return product.variants?.find(
        (variant) =>
          variant.size === selectedSize &&
          variant.color === colour &&
          variant.stock > 0
      );
    }
    return undefined;
  }

  async function handleAddToCart() {
    try {
      setAdding(true);
      setMessage("");

      const selectedVariant = findVariant();

      if (!selectedVariant) {
        throw new Error(
          "Please select an available size and colour."
        );
      }

      await addToCart(selectedVariant.id, quantity);

      setMessage("Product added to cart.");
    } catch (error) {
      console.error("Add to cart error:", error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to add product to cart."
      );
    } finally {
      setAdding(false);
    }
  }

  async function handleToggleWishlist() {
    if (!user) {
      setMessage("Please log in to add items to your wishlist.");
      return;
    }

    try {
      if (isInWishlist) {
        const item = wishlist.find(
          (wishlistItem) => wishlistItem.productId === product.id
        );

        if (item) {
          await removeFromWishlist(item.id);
        }
      } else {
        await addToWishlist(product.id);
      }
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to update wishlist."
      );
    }
  }

  return (
    <div>
      <p className="uppercase tracking-[0.35em] text-[#D4AF37]">
        {product.category?.name ?? ""}
      </p>

      <h1 className="mt-5 font-serif text-6xl">
        {product.name}
      </h1>

      <p className="mt-6 text-3xl text-[#D4AF37]">
        KSh {Number(product.price).toLocaleString()}
      </p>

      <p className="mt-8 leading-8 text-gray-400">
        {product.description}
      </p>

      {availableSizes.length > 0 && (
        <div className="mt-10">
          <h3 className="mb-4 font-semibold">
            Size
          </h3>

          <div className="flex flex-wrap gap-3">
            {availableSizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`rounded-lg border px-5 py-3 transition ${
                  selectedSize === size
                    ? "border-[#D4AF37] bg-[#D4AF37] text-black"
                    : "border-[#333] text-white"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {availableColours.length > 0 && (
        <div className="mt-10">
          <h3 className="mb-4 font-semibold">
            Colour
          </h3>

          <div className="flex flex-wrap gap-3">
            {availableColours.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setColour(item)}
                className={`rounded-lg border px-5 py-3 transition ${
                  colour === item
                    ? "border-[#D4AF37] bg-[#D4AF37] text-black"
                    : "border-[#333] text-white"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10 flex items-center gap-4">
        <button
          type="button"
          onClick={() =>
            quantity > 1 &&
            setQuantity(quantity - 1)
          }
          className="h-12 w-12 rounded-lg border border-[#333]"
        >
          -
        </button>

        <span className="text-xl">
          {quantity}
        </span>

        <button
          type="button"
          onClick={() =>
            setQuantity(quantity + 1)
          }
          className="h-12 w-12 rounded-lg border border-[#333]"
        >
          +
        </button>
      </div>

      {message && (
        <p className="mt-5 text-sm text-gray-300">
          {message}
        </p>
      )}

      <button
        type="button"
        disabled={adding}
        onClick={handleAddToCart}
        className="mt-10 w-full rounded-xl bg-[#D4AF37] py-5 font-bold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {adding ? "Adding..." : "Add To Cart"}
      </button>

      <button
        type="button"
        onClick={handleToggleWishlist}
        className={`mt-5 flex items-center gap-3 transition ${
          isInWishlist
            ? "text-[#D4AF37]"
            : "text-gray-300 hover:text-[#D4AF37]"
        }`}
      >
        <Heart size={20} fill={isInWishlist ? "currentColor" : "none"} />
        {isInWishlist ? "In Wishlist" : "Add To Wishlist"}
      </button>
    </div>
  );
}