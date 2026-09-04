import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { createOrder, updateOrderPayment, updateOrderDelivery } from "../api/orders.api";
import { addOrder, updateOrderInList } from "../slice/ordersSlice";
import type { AppDispatch } from "../../../store-config/store";

export function useCreateOrder() {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { shipping_address?: string; shipping_zone_id?: number } = {}) =>
      createOrder(data),
    onSuccess: (order) => {
      dispatch(addOrder(order));
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useUpdateOrderPayment() {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: { payment_status: string; transaction_ref?: string };
    }) => updateOrderPayment(id, data),
    onSuccess: (order) => {
      dispatch(updateOrderInList(order));
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useUpdateOrderDelivery() {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { delivery_status: string } }) =>
      updateOrderDelivery(id, data),
    onSuccess: (order) => {
      dispatch(updateOrderInList(order));
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}
