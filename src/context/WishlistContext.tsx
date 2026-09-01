"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { Product, WishlistItem } from "@/types/models";

interface WishlistContextType {
  wishlist: WishlistItem[];
  loading: boolean;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (itemId: string) => Promise<void>;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

export function WishlistProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function refreshWishlist() {
    try {
      const response = await fetch("/api/wishlist", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      if (!response.ok) {
        if (response.status === 401) {
          setWishlist([]);
          return;
        }

        throw new Error("Unable to load wishlist.");
      }

      const data = await response.json();
      setWishlist(data.wishlist?.items ?? []);
    } catch (error) {
      console.error("Load wishlist error:", error);
      setWishlist([]);
    }
  }

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const response = await fetch("/api/wishlist", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (!mounted) return;

        if (response.status === 401) {
          setWishlist([]);
          return;
        }

        if (!response.ok) {
          throw new Error("Unable to load wishlist.");
        }

        const data = await response.json();
        setWishlist(data.wishlist?.items ?? []);
      } catch (error) {
        console.error("Initial wishlist load error:", error);
        setWishlist([]);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  async function addToWishlist(productId: string) {
    const response = await fetch("/api/wishlist/items", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Unable to add product to wishlist.");
    }

    await refreshWishlist();
  }

  async function removeFromWishlist(itemId: string) {
    const response = await fetch(`/api/wishlist/items/${itemId}`, {
      method: "DELETE",
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Unable to remove wishlist item.");
    }

    await refreshWishlist();
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        addToWishlist,
        removeFromWishlist,
        refreshWishlist,
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

// Re-export for convenience so components can import the type
// from the same place they import the hook.
export type { Product, WishlistItem };