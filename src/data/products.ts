export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  images: string[];
  badge?: string;
  description: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: "IRG Oversized Tee",
    category: "Men",
    price: 3499,
    image: "/images/products/tshirt-01.jpg",
    images: [
      "/images/products/tshirt-01.jpg",
      "/images/products/tshirt-01.jpg",
      "/images/products/tshirt-01.jpg",
    ],
    badge: "NEW",
    description:
      "Premium heavyweight oversized T-shirt crafted for everyday luxury. Designed with premium cotton, relaxed fit, and timeless IRG aesthetics.",
  },

  {
    id: 2,
    name: "IRG Signature Jacket",
    category: "Men",
    price: 8999,
    image: "/images/products/jacket-01.jpg",
    images: [
      "/images/products/jacket-01.jpg",
      "/images/products/jacket-01.jpg",
      "/images/products/jacket-01.jpg",
    ],
    badge: "BESTSELLER",
    description:
      "Luxury bomber jacket with premium finishes, soft lining, and modern tailoring for everyday elegance.",
  },

  {
    id: 3,
    name: "IRG Cargo Pants",
    category: "Men",
    price: 5999,
    image: "/images/products/cargo-01.jpg",
    images: [
      "/images/products/cargo-01.jpg",
      "/images/products/cargo-01.jpg",
      "/images/products/cargo-01.jpg",
    ],
    badge: "LIMITED",
    description:
      "Modern cargo trousers engineered for comfort, utility and luxury streetwear.",
  },

  {
    id: 4,
    name: "IRG Leather Sneakers",
    category: "Footwear",
    price: 9999,
    image: "/images/products/sneaker-01.jpg",
    images: [
      "/images/products/sneaker-01.jpg",
      "/images/products/sneaker-01.jpg",
      "/images/products/sneaker-01.jpg",
    ],
    badge: "HOT",
    description:
      "Premium leather sneakers with handcrafted detailing and superior comfort.",
  },

  {
    id: 5,
    name: "IRG Women's Dress",
    category: "Women",
    price: 7499,
    image: "/images/products/dress-01.jpg",
    images: [
      "/images/products/dress-01.jpg",
      "/images/products/dress-01.jpg",
      "/images/products/dress-01.jpg",
    ],
    badge: "NEW",
    description:
      "Elegant luxury dress tailored for modern women with premium fabrics and timeless styling.",
  },

  {
    id: 6,
    name: "IRG Crossbody Bag",
    category: "Accessories",
    price: 4999,
    image: "/images/products/bag-01.jpg",
    images: [
      "/images/products/bag-01.jpg",
      "/images/products/bag-01.jpg",
      "/images/products/bag-01.jpg",
    ],
    badge: "TRENDING",
    description:
      "Minimal luxury crossbody bag featuring premium hardware and durable craftsmanship.",
  },

  {
    id: 7,
    name: "IRG Denim Jeans",
    category: "Men",
    price: 6499,
    image: "/images/products/jeans-01.jpg",
    images: [
      "/images/products/jeans-01.jpg",
      "/images/products/jeans-01.jpg",
      "/images/products/jeans-01.jpg",
    ],
    badge: "NEW",
    description:
      "Luxury denim engineered for durability, comfort and modern streetwear styling.",
  },

  {
    id: 8,
    name: "IRG Luxury Cap",
    category: "Accessories",
    price: 2999,
    image: "/images/products/cap-01.jpg",
    images: [
      "/images/products/cap-01.jpg",
      "/images/products/cap-01.jpg",
      "/images/products/cap-01.jpg",
    ],
    badge: "HOT",
    description:
      "Signature IRG premium cap featuring embroidered branding and an adjustable luxury fit.",
  },
];