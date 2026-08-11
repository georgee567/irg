export interface Product {
  id: number;
  name: string;
  slug: string;
  category: string;
  price: number;
  image: string;
  description: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: "IRG Signature Hoodie",
    slug: "irg-signature-hoodie",
    category: "Hoodies",
    price: 5999,
    image: "/images/products/jacket-01.jpg",
    description: "Premium heavyweight luxury hoodie crafted for everyday elegance.",
  },
  {
    id: 2,
    name: "IRG Oversized Tee",
    slug: "irg-oversized-tee",
    category: "T-Shirts",
    price: 3499,
    image: "/images/products/tshirt-01.jpg",
    description: "Minimal oversized t-shirt with premium cotton construction.",
  },
  {
    id: 3,
    name: "IRG Cargo Pants",
    slug: "irg-cargo-pants",
    category: "Pants",
    price: 6499,
    image: "/images/products/cargo-01.jpg",
    description: "Luxury streetwear cargo trousers with tailored comfort.",
  },
  {
    id: 4,
    name: "IRG Bomber Jacket",
    slug: "irg-bomber-jacket",
    category: "Jackets",
    price: 8999,
    image: "/images/products/jacket-01.jpg",
    description: "Premium bomber jacket inspired by modern luxury fashion.",
  },
];