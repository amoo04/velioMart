import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { createPayment, updatePaymentStatus } from "../api/payments.api";
import { addPayment, updatePaymentInList } from "../slice/paymentsSlice";
import type { AppDispatch } from "../../../store-config/store";

export function useCreatePayment() {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { order_id: number; payment_method?: string }) => createPayment(data),
    onSuccess: (payment) => {
      dispatch(addPayment(payment));
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });
}

export function useUpdatePaymentStatus() {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: { payment_status: string; transaction_ref?: string };
    }) => updatePaymentStatus(id, data),
    onSuccess: (payment) => {
      dispatch(updatePaymentInList(payment));
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });
}
