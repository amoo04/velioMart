import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { createCategory, updateCategory, deleteCategory } from "../api/categories.api";
import type { CategoryInput } from "../api/categories.api";
import { addCategory, updateCategory as updateCategoryAction, removeCategory } from "../slice/categoriesSlice";
import type { AppDispatch } from "../../../store-config/store";

export type { CategoryInput } from "../api/categories.api";

export function useCreateCategory() {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CategoryInput) => createCategory(data),
    onSuccess: (category) => {
      dispatch(addCategory(category));
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useUpdateCategory() {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CategoryInput> }) => updateCategory(id, data),
    onSuccess: (category) => {
      dispatch(updateCategoryAction(category));
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useDeleteCategory() {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteCategory(id).then(() => id),
    onSuccess: (id) => {
      dispatch(removeCategory(id));
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}
