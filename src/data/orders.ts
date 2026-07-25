export interface Order {
  id: number;
  total: number;
  status: string;
  date: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
}

export const orders: Order[] = [];