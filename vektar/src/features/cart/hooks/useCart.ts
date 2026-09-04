import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "../api/cart.api";
import { setCart } from "../slice/cartSlice";
import type { AppDispatch, RootState } from "../../../store-config/store";

export type { CartItem } from "../slice/cartSlice";

export interface CartSummary {
  itemCount: number;
  subtotal: number;
}

export function useCartQuery() {
  const dispatch = useDispatch<AppDispatch>();

  const query = useQuery({
    queryKey: ["cart"],
    queryFn: fetchCart,
  });

  useEffect(() => {
    if (query.data) dispatch(setCart(query.data));
  }, [query.data, dispatch]);

  return query;
}

export function useCartSummary(): CartSummary {
  const items = useSelector((state: RootState) => state.cart.items);
  const products = useSelector((state: RootState) => state.products.list);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.product_id);
    return sum + (product?.price ?? 0) * item.quantity;
  }, 0);

  return { itemCount, subtotal };
}
