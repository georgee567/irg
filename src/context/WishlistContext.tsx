"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { Product } from "@/data/products";

interface WishlistContextType {
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (id: number) => void;
  isInWishlist: (id: number) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

export function WishlistProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [wishlist, setWishlist] = useState<Product[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("irg-wishlist");

    if (saved) {
      setWishlist(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "irg-wishlist",
      JSON.stringify(wishlist)
    );
  }, [wishlist]);

  const addToWishlist = (product: Product) => {
    setWishlist((prev) => {
      if (prev.some((item) => item.id === product.id)) {
        return prev;
      }

      return [...prev, product];
    });
  };

  const removeFromWishlist = (id: number) => {
    setWishlist((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  const isInWishlist = (id: number) => {
    return wishlist.some((item) => item.id === id);
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error(
      "useWishlist must be used inside WishlistProvider"
    );
  }

  return context;
}