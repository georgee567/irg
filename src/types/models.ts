export interface Product {
  id: number;
  name: string;
  slug: string;
  category: string;
  price: number;
  image: string;
  description: string;
  stock?: number;
  status?: "In Stock" | "Limited" | "Out of Stock";
  colors?: string[];
  sizes?: string[];
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface WishlistItem {
  id: number;
  name: string;
  image: string;
  price: number;
  slug?: string;
  category?: string;
}

export interface User {
  name: string;
  email: string;
  phone?: string;
  county?: string;
  city?: string;
  address?: string;
  avatar?: string;
  role?: "customer" | "admin";
}

export interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  selectedSize?: string;
  selectedColor?: string;
}

export type OrderStatus = "Processing" | "Packed" | "Shipped" | "Delivered";
export type PaymentStatus = "Pending" | "Selected" | "Processed";

export interface OrderSummary {
  id: string;
  date: string;
  status: OrderStatus;
  payment: string;
  paymentStatus: PaymentStatus;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    county: string;
    city: string;
    address: string;
  };
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  items: OrderItem[];
}

export interface CheckoutFormValues {
  fullName: string;
  email: string;
  phone: string;
  county: string;
  city: string;
  address: string;
}
