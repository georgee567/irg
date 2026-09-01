// Shared types matching the Prisma models and API responses.

export interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  _count?: { products: number };
}

export interface ProductVariant {
  id: string;
  size: string;
  color: string;
  price: string | number;
  stock: number;
  productId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: string | number;
  images: string[];
  featured: boolean;
  categoryId: string;
  category: Category;
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

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

export interface WishlistItem {
  id: string;
  productId: string;
  product: Product;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantId: string;
  productName: string;
  size: string;
  color: string;
  unitPrice: string | number;
  quantity: number;
  lineTotal: string | number;
  createdAt: string;
}

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentStatusEnum =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "REFUNDED";

export interface Payment {
  id: string;
  orderId: string;
  provider: string;
  method: string;
  transactionReference: string | null;
  amount: string | number;
  currency: string;
  status: PaymentStatusEnum;
  providerResponse: unknown;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  paymentStatus: PaymentStatusEnum;
  subtotal: string | number;
  shipping: string | number;
  total: string | number;
  shippingName: string;
  shippingEmail: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingCountry: string;
  items: OrderItem[];
  payments: Payment[];
  createdAt: string;
  updatedAt: string;
}