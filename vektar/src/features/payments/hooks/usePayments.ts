import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { fetchPayments, fetchPayment } from "../api/payments.api";
import { setPayments, setSelectedPayment } from "../slice/paymentsSlice";
import type { AppDispatch } from "../../../store-config/store";

export type { Payment } from "../slice/paymentsSlice";

export function usePaymentsQuery() {
  const dispatch = useDispatch<AppDispatch>();

  const query = useQuery({
    queryKey: ["payments"],
    queryFn: fetchPayments,
  });

  useEffect(() => {
    if (query.data) dispatch(setPayments(query.data));
  }, [query.data, dispatch]);

  return query;
}

export function usePaymentQuery(id: number | string | undefined) {
  const dispatch = useDispatch<AppDispatch>();

  const query = useQuery({
    queryKey: ["payments", "detail", id],
    queryFn: () => fetchPayment(id!),
    enabled: id !== undefined,
  });

  useEffect(() => {
    if (query.data) dispatch(setSelectedPayment(query.data));
  }, [query.data, dispatch]);

  return query;
}
