import { apiGet, apiPost, apiPatch } from "../../../lib/api";
import type { Payment } from "../slice/paymentsSlice";

export async function fetchPayments(): Promise<Payment[]> {
  const res = await apiGet<Payment[]>("/api/payments");
  if (res.error) throw new Error(res.error);
  return res.data ?? [];
}

export async function fetchPayment(id: number | string): Promise<Payment> {
  const res = await apiGet<Payment>(`/api/payments/${id}`);
  if (res.error) throw new Error(res.error);
  return res.data!;
}

export async function createPayment(data: {
  order_id: number;
  payment_method?: string;
}): Promise<Payment> {
  const res = await apiPost<Payment>("/api/payments", data);
  if (res.error) throw new Error(res.error);
  return res.data!;
}

export async function updatePaymentStatus(
  id: number,
  data: { payment_status: string; transaction_ref?: string },
): Promise<Payment> {
  const res = await apiPatch<Payment>(`/api/payments/${id}/status`, data);
  if (res.error) throw new Error(res.error);
  return res.data!;
}
