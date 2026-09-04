import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAbandonedCarts, processReminders, deleteAbandonedCart } from "../api/abandoned-carts.api";

export function useAbandonedCartsQuery(thresholdHours: number) {
  return useQuery({
    queryKey: ["admin", "abandoned-carts", thresholdHours],
    queryFn: () => fetchAbandonedCarts(thresholdHours),
  });
}

export function useProcessReminders() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (thresholdHours: number) => processReminders(thresholdHours),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "abandoned-carts"] }),
  });
}

export function useDeleteAbandonedCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: number) => deleteAbandonedCart(userId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "abandoned-carts"] }),
  });
}
