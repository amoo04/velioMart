import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProductReviews, createReview } from "../api/reviews.api";
import type { CreateReviewInput } from "../api/reviews.api";

export function useProductReviewsQuery(productId: number) {
  return useQuery({
    queryKey: ["reviews", productId],
    queryFn: () => fetchProductReviews(productId),
    enabled: Number.isFinite(productId),
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateReviewInput) => createReview(data),
    onSuccess: (_review, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", variables.productId] });
    },
  });
}
