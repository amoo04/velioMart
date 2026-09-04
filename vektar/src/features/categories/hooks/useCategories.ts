import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { fetchCategories, fetchCategory } from "../api/categories.api";
import { setCategories, setSelectedCategory } from "../slice/categoriesSlice";
import type { AppDispatch } from "../../../store-config/store";

export type { Category } from "../slice/categoriesSlice";

export function useCategoriesQuery() {
  const dispatch = useDispatch<AppDispatch>();

  const query = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  useEffect(() => {
    if (query.data) dispatch(setCategories(query.data));
  }, [query.data, dispatch]);

  return query;
}

export function useCategoryQuery(id: number | string | undefined) {
  const dispatch = useDispatch<AppDispatch>();

  const query = useQuery({
    queryKey: ["categories", "detail", id],
    queryFn: () => fetchCategory(id!),
    enabled: id !== undefined,
  });

  useEffect(() => {
    if (query.data) dispatch(setSelectedCategory(query.data));
  }, [query.data, dispatch]);

  return query;
}
