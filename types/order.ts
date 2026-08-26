import { CartItem } from "./cart";

export interface Order {
  id: number;
  user: number;
  items: CartItem[];
  amount: string;
  email: string;
  reference: string;
  metadata: Record<string, unknown>;
  status: string;
  created_at: string;
}

export interface CreateOrderResponse {
  authorization_url: string;
  reference: string;
}