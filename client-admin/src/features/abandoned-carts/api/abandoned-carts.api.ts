import { apiGet, apiPost, apiDelete } from "../../../lib/api";

export interface AbandonedCart {
  user_id: number;
  email: string;
  name: string;
  items: number;
  total: number;
  abandoned_at: string;
  reminded_count: number;
  flagged: boolean;
}

export interface AbandonedCartsSummary {
  flagged: number;
  reminded: number;
  recovered: number;
  recoveredPercent: number;
  revenueRecovered: number;
  carts: AbandonedCart[];
}

export async function fetchAbandonedCarts(thresholdHours: number): Promise<AbandonedCartsSummary> {
  const res = await apiGet<AbandonedCartsSummary>(
    `/api/admin/abandoned-carts?thresholdHours=${thresholdHours}`,
  );
  if (res.error) throw new Error(res.error);
  return res.data!;
}

export async function processReminders(thresholdHours: number): Promise<{ sent: number }> {
  const res = await apiPost<{ sent: number }>("/api/admin/abandoned-carts/process", { thresholdHours });
  if (res.error) throw new Error(res.error);
  return res.data!;
}

export async function deleteAbandonedCart(userId: number): Promise<void> {
  const res = await apiDelete(`/api/admin/abandoned-carts/${userId}`);
  if (res.error) throw new Error(res.error);
}
