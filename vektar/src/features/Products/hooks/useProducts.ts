import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { fetchProducts, fetchProduct } from "../api/products.api";
import type { ProductFilters } from "../api/products.api";
import { setProducts, setSelectedProduct } from "../slice/productsSlice";
import type { AppDispatch } from "../../../store-config/store";

export type { Product } from "../slice/productsSlice";
export type { ProductFilters } from "../api/products.api";

export function useProductsQuery(filters?: ProductFilters) {
  const dispatch = useDispatch<AppDispatch>();

  const query = useQuery({
    queryKey: ["products", filters ?? {}],
    queryFn: () => fetchProducts(filters),
  });

  useEffect(() => {
    if (query.data) dispatch(setProducts(query.data));
  }, [query.data, dispatch]);

  return query;
}

export function useProductQuery(id: number | string | undefined) {
  const dispatch = useDispatch<AppDispatch>();

  const query = useQuery({
    queryKey: ["products", "detail", id],
    queryFn: () => fetchProduct(id!),
    enabled: id !== undefined,
  });

  useEffect(() => {
    if (query.data) dispatch(setSelectedProduct(query.data));
  }, [query.data, dispatch]);

  return query;
}
