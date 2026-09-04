import { apiGet, apiPatch } from "../../../lib/api";

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  product_name: string | null;
  product_image_url: string | null;
}

export interface Order {
  id: number;
  order_code: string;
  user_id: number;
  customer_email: string | null;
  customer_name: string | null;
  customer_phone?: string | null;
  total_amount: number;
  delivery_fee: number;
  payment_status: string;
  delivery_status: string;
  transaction_ref: string | null;
  shipping_address: string | null;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

export async function fetchAllOrders(): Promise<Order[]> {
  const res = await apiGet<Order[]>("/api/orders/all");
  if (res.error) throw new Error(res.error);
  return res.data ?? [];
}

export async function fetchOrderById(id: number): Promise<Order> {
  const res = await apiGet<Order>(`/api/orders/${id}`);
  if (res.error) throw new Error(res.error);
  return res.data!;
}

export async function updateOrderPayment(
  id: number,
  data: { payment_status: string; transaction_ref?: string },
) {
  const res = await apiPatch(`/api/orders/${id}/payment`, data);
  if (res.error) throw new Error(res.error);
  return res.data;
}

export async function updateOrderDelivery(id: number, data: { delivery_status: string }) {
  const res = await apiPatch(`/api/orders/${id}/delivery`, data);
  if (res.error) throw new Error(res.error);
  return res.data;
}
