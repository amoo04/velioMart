import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAllOrders, fetchOrderById, updateOrderPayment, updateOrderDelivery } from "../api/orders.api";

export function useAllOrdersQuery() {
  return useQuery({
    queryKey: ["admin", "orders"],
    queryFn: fetchAllOrders,
  });
}

export function useOrderQuery(id: number) {
  return useQuery({
    queryKey: ["admin", "orders", id],
    queryFn: () => fetchOrderById(id),
  });
}

export function useUpdateOrderPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: { payment_status: string; transaction_ref?: string };
    }) => updateOrderPayment(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "orders"] }),
  });
}

export function useUpdateOrderDelivery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { delivery_status: string } }) =>
      updateOrderDelivery(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "orders"] }),
  });
}
