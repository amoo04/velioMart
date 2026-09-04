import { apiGet, apiPost, apiPatch, apiDelete } from "../../../lib/api";
import type { Product } from "../slice/productsSlice";

export interface ProductFilters {
  categoryId?: number;
  status?: string;
  search?: string;
}

export interface ProductInput {
  name: string;
  description?: string | null;
  price: number;
  stock?: number;
  category_id?: number | null;
  image_url?: string | null;
  brand?: string | null;
  status?: string;
}

export async function fetchProducts(filters?: ProductFilters): Promise<Product[]> {
  const params = new URLSearchParams();
  if (filters?.categoryId) params.set("categoryId", String(filters.categoryId));
  if (filters?.status) params.set("status", filters.status);
  if (filters?.search) params.set("search", filters.search);
  const qs = params.toString();
  const res = await apiGet<Product[]>(`/api/products${qs ? `?${qs}` : ""}`);
  if (res.error) throw new Error(res.error);
  return res.data ?? [];
}

export async function fetchProduct(id: number | string): Promise<Product> {
  const res = await apiGet<Product>(`/api/products/${id}`);
  if (res.error) throw new Error(res.error);
  return res.data!;
}

export async function createProduct(data: ProductInput): Promise<Product> {
  const res = await apiPost<Product>("/api/products", data);
  if (res.error) throw new Error(res.error);
  return res.data!;
}

export async function updateProduct(id: number, data: Partial<ProductInput>): Promise<Product> {
  const res = await apiPatch<Product>(`/api/products/${id}`, data);
  if (res.error) throw new Error(res.error);
  return res.data!;
}

export async function deleteProduct(id: number): Promise<void> {
  const res = await apiDelete(`/api/products/${id}`);
  if (res.error) throw new Error(res.error);
}
