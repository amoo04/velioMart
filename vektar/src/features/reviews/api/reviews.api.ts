import { apiGet, apiPost } from "../../../lib/api";

export interface Review {
  id: number;
  product_id: number;
  user_id: number;
  customer_name: string;
  customer_email: string;
  rating: number;
  comment: string | null;
  status: string;
  created_at: string;
}

export interface CreateReviewInput {
  productId: number;
  rating: number;
  comment?: string;
}

export async function fetchProductReviews(productId: number): Promise<Review[]> {
  const res = await apiGet<Review[]>(`/api/reviews?productId=${productId}`);
  if (res.error) throw new Error(res.error);
  return res.data ?? [];
}

export async function createReview(data: CreateReviewInput): Promise<Review> {
  const res = await apiPost<Review>("/api/reviews", data);
  if (res.error) throw new Error(res.error);
  return res.data!;
}
