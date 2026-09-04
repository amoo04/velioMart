import { apiGet, apiPost, apiPatch, apiDelete } from "../../../lib/api";
import type { CartItem } from "../slice/cartSlice";

export async function fetchCart(): Promise<CartItem[]> {
  const res = await apiGet<CartItem[]>("/api/carts");
  if (res.error) throw new Error(res.error);
  return res.data ?? [];
}

export async function addCartItem(productId: number, quantity = 1): Promise<CartItem> {
  const res = await apiPost<CartItem>("/api/carts", { productId, quantity });
  if (res.error) throw new Error(res.error);
  return res.data!;
}

export async function updateCartItemQuantity(productId: number, quantity: number): Promise<CartItem> {
  const res = await apiPatch<CartItem>(`/api/carts/${productId}`, { quantity });
  if (res.error) throw new Error(res.error);
  return res.data!;
}

export async function removeCartItem(productId: number): Promise<void> {
  const res = await apiDelete(`/api/carts/${productId}`);
  if (res.error) throw new Error(res.error);
}

export async function clearCartItems(): Promise<void> {
  const res = await apiDelete("/api/carts");
  if (res.error) throw new Error(res.error);
}
