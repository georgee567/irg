"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export interface WishlistItem {
  id: number;
  name: string;
  image: string;
  price: number;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: number) => void;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({
  children,
}: {
  children: ReactNode;
}) {

  const [wishlist, setWishlist] =
    useState<WishlistItem[]>([]);

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

  const addToWishlist = (item: WishlistItem) => {

    if (
      wishlist.find((p) => p.id === item.id)
    )
      return;

    setWishlist((prev) => [...prev, item]);
  };

  const removeFromWishlist = (
    id: number
  ) => {
    setWishlist((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {

  const context =
    useContext(WishlistContext);

  if (!context)
    throw new Error(
      "WishlistProvider missing"
    );

  return context;
}