"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export interface CartItem {
  id: string;
  variantId: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  slug?: string;
  category?: string;
  stock?: number;
}

interface CartContextType {
  cart: CartItem[];
  loading: boolean;
  addToCart: (variantId: string, quantity?: number) => Promise<void>;
  increaseQuantity: (id: string) => Promise<void>;
  decreaseQuantity: (id: string) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function refreshCart() {
    try {
      const response = await fetch("/api/cart", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      if (!response.ok) {
        if (response.status === 401) {
          setCart([]);
          return;
        }

        throw new Error("Unable to load cart.");
      }

      const data = await response.json();

      const items: CartItem[] = (data.cart?.items ?? []).map(
        (item: {
          id: string;
          quantity: number;
          variant: {
            id: string;
            size: string;
            color: string;
            price: string | number;
            stock: number;
            product: {
              id: string;
              name: string;
              slug: string;
              images: string[];
              category?: {
                name?: string;
              } | null;
            };
          };
        }) => ({
          id: item.id,
          variantId: item.variant.id,
          productId: item.variant.product.id,
          name: item.variant.product.name,
          image: item.variant.product.images?.[0] ?? "",
          price: Number(item.variant.price),
          quantity: item.quantity,
          selectedSize: item.variant.size,
          selectedColor: item.variant.color,
          slug: item.variant.product.slug,
          category: item.variant.product.category?.name,
          stock: item.variant.stock,
        })
      );

      setCart(items);
    } catch (error) {
      console.error("Load cart error:", error);
      setCart([]);
    }
  }

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const response = await fetch("/api/cart", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (!mounted) return;

        if (response.status === 401) {
          setCart([]);
          return;
        }

        if (!response.ok) {
          throw new Error("Unable to load cart.");
        }

        const data = await response.json();

        const items: CartItem[] = (data.cart?.items ?? []).map(
          (item: {
            id: string;
            quantity: number;
            variant: {
              id: string;
              size: string;
              color: string;
              price: string | number;
              stock: number;
              product: {
                id: string;
                name: string;
                slug: string;
                images: string[];
                category?: {
                  name?: string;
                } | null;
              };
            };
          }) => ({
            id: item.id,
            variantId: item.variant.id,
            productId: item.variant.product.id,
            name: item.variant.product.name,
            image: item.variant.product.images?.[0] ?? "",
            price: Number(item.variant.price),
            quantity: item.quantity,
            selectedSize: item.variant.size,
            selectedColor: item.variant.color,
            slug: item.variant.product.slug,
            category: item.variant.product.category?.name,
            stock: item.variant.stock,
          })
        );

        setCart(items);
      } catch (error) {
        console.error("Initial cart load error:", error);
        setCart([]);
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

  async function addToCart(
    variantId: string,
    quantity: number = 1
  ) {
    const response = await fetch("/api/cart/items", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        variantId,
        quantity,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Unable to add item to cart.");
    }

    await refreshCart();
  }

  async function increaseQuantity(id: string) {
    const item = cart.find((cartItem) => cartItem.id === id);

    if (!item) return;

    const response = await fetch(`/api/cart/items/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quantity: item.quantity + 1,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Unable to increase quantity.");
    }

    await refreshCart();
  }

  async function decreaseQuantity(id: string) {
    const item = cart.find((cartItem) => cartItem.id === id);

    if (!item) return;

    if (item.quantity <= 1) {
      await removeFromCart(id);
      return;
    }

    const response = await fetch(`/api/cart/items/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quantity: item.quantity - 1,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Unable to decrease quantity.");
    }

    await refreshCart();
  }

  async function removeFromCart(id: string) {
    const response = await fetch(`/api/cart/items/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Unable to remove item.");
    }

    await refreshCart();
  }

  async function clearCart() {
    const response = await fetch("/api/cart", {
      method: "DELETE",
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Unable to clear cart.");
    }

    setCart([]);
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}