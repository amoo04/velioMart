import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { addCartItem, updateCartItemQuantity, removeCartItem, clearCartItems } from "../api/cart.api";
import { upsertCartItem, removeFromCart, clearCart as clearCartAction } from "../slice/cartSlice";
import type { AppDispatch } from "../../../store-config/store";

export function useAddToCart() {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, quantity = 1 }: { productId: number; quantity?: number }) =>
      addCartItem(productId, quantity),
    onSuccess: (item) => {
      dispatch(upsertCartItem(item));
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useUpdateCartQuantity() {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: number; quantity: number }) =>
      updateCartItemQuantity(productId, quantity),
    onSuccess: (item) => {
      dispatch(upsertCartItem(item));
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useRemoveFromCart() {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: number) => removeCartItem(productId).then(() => productId),
    onSuccess: (productId) => {
      dispatch(removeFromCart(productId));
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useClearCart() {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearCartItems,
    onSuccess: () => {
      dispatch(clearCartAction());
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}
