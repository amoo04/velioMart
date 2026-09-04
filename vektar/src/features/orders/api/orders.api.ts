import { apiGet, apiPost, apiPatch } from "../../../lib/api";
import type { Order, OrderRow } from "../slice/ordersSlice";

export async function fetchOrders(): Promise<Order[]> {
  const res = await apiGet<Order[]>("/api/orders");
  if (res.error) throw new Error(res.error);
  return res.data ?? [];
}

export async function fetchOrder(id: number | string): Promise<Order> {
  const res = await apiGet<Order>(`/api/orders/${id}`);
  if (res.error) throw new Error(res.error);
  return res.data!;
}

export async function createOrder(
  data: { shipping_address?: string; shipping_zone_id?: number } = {},
): Promise<Order> {
  const res = await apiPost<Order>("/api/orders", data);
  if (res.error) throw new Error(res.error);
  return res.data!;
}

export async function updateOrderPayment(
  id: number,
  data: { payment_status: string; transaction_ref?: string },
): Promise<OrderRow> {
  const res = await apiPatch<OrderRow>(`/api/orders/${id}/payment`, data);
  if (res.error) throw new Error(res.error);
  return res.data!;
}

export async function updateOrderDelivery(
  id: number,
  data: { delivery_status: string },
): Promise<OrderRow> {
  const res = await apiPatch<OrderRow>(`/api/orders/${id}/delivery`, data);
  if (res.error) throw new Error(res.error);
  return res.data!;
}
