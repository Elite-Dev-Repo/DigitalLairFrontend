export interface CartItem {
  id: number;
  product: string;
  quantity: number;
  subtotal: string;
}

export interface Cart {
  id: number;
  user: number;
  items: CartItem[];
  total: string;
  created_at: string;
}