export interface OrderItem {
  id: number;
  name: string;
  image: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  total: number;
  status: string;
  date: string;
  items: OrderItem[];
}

export const orders: Order[] = [];