export interface Order {
  id: string;
  date: string;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  total: number;

  items: {
    id: number;
    name: string;
    image: string;
    quantity: number;
    price: number;
  }[];
}

export const orders: Order[] = [
  {
    id: "IRG-1001",
    date: "14 July 2026",
    status: "Delivered",
    total: 14800,

    items: [
      {
        id: 1,
        name: "IRG Essential Hoodie",
        image: "/products/hoodie.jpg",
        quantity: 1,
        price: 8200,
      },
      {
        id: 5,
        name: "IRG Cargo Pants",
        image: "/products/cargo.jpg",
        quantity: 1,
        price: 6600,
      },
    ],
  },

  {
    id: "IRG-1002",
    date: "20 July 2026",
    status: "Processing",
    total: 9400,

    items: [
      {
        id: 7,
        name: "IRG Oversized Tee",
        image: "/products/tshirt.jpg",
        quantity: 2,
        price: 4700,
      },
    ],
  },
];