import { apiGet, apiPatch, apiDelete } from "../../../lib/api";

export interface Review {
  id: number;
  product_id: number;
  product_name: string;
  user_id: number;
  customer_name: string;
  customer_email: string;
  rating: number;
  comment: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

export async function fetchAllReviews(status?: string): Promise<Review[]> {
  const qs = status ? `?status=${status}` : "";
  const res = await apiGet<Review[]>(`/api/reviews/all${qs}`);
  if (res.error) throw new Error(res.error);
  return res.data ?? [];
}

export async function updateReviewStatus(id: number, status: string): Promise<Review> {
  const res = await apiPatch<Review>(`/api/reviews/${id}/status`, { status });
  if (res.error) throw new Error(res.error);
  return res.data!;
}

export async function deleteReview(id: number): Promise<void> {
  const res = await apiDelete(`/api/reviews/${id}`);
  if (res.error) throw new Error(res.error);
}
