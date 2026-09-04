import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { createProduct, updateProduct, deleteProduct } from "../api/products.api";
import type { ProductInput } from "../api/products.api";
import { addProduct, updateProduct as updateProductAction, removeProduct } from "../slice/productsSlice";
import type { AppDispatch } from "../../../store-config/store";

export type { ProductInput } from "../api/products.api";

export function useCreateProduct() {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProductInput) => createProduct(data),
    onSuccess: (product) => {
      dispatch(addProduct(product));
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateProduct() {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ProductInput> }) => updateProduct(id, data),
    onSuccess: (product) => {
      dispatch(updateProductAction(product));
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useDeleteProduct() {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteProduct(id).then(() => id),
    onSuccess: (id) => {
      dispatch(removeProduct(id));
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
