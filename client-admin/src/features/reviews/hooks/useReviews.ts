import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAllReviews, updateReviewStatus, deleteReview } from "../api/reviews.api";

export function useReviewsQuery(status?: string) {
  return useQuery({
    queryKey: ["admin", "reviews", status ?? "all"],
    queryFn: () => fetchAllReviews(status),
  });
}

export function useUpdateReviewStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => updateReviewStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] }),
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteReview(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] }),
  });
}
