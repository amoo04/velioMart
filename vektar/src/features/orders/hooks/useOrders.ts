import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { fetchOrders, fetchOrder } from "../api/orders.api";
import { setOrders, setSelectedOrder } from "../slice/ordersSlice";
import type { AppDispatch } from "../../../store-config/store";

export type { Order, OrderItem, OrderRow } from "../slice/ordersSlice";

export function useOrdersQuery() {
  const dispatch = useDispatch<AppDispatch>();

  const query = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });

  useEffect(() => {
    if (query.data) dispatch(setOrders(query.data));
  }, [query.data, dispatch]);

  return query;
}

export function useOrderQuery(id: number | string | undefined) {
  const dispatch = useDispatch<AppDispatch>();

  const query = useQuery({
    queryKey: ["orders", "detail", id],
    queryFn: () => fetchOrder(id!),
    enabled: id !== undefined,
  });

  useEffect(() => {
    if (query.data) dispatch(setSelectedOrder(query.data));
  }, [query.data, dispatch]);

  return query;
}
