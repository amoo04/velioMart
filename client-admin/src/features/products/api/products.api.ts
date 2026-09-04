import { apiGet, apiPost, apiPatch, apiDelete } from "../../../lib/api";

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  category_id: number | null;
  image_url: string | null;
  brand: string | null;
  status: string;
  created_at: string;
  updated_at: string;
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

export async function fetchProducts(search?: string): Promise<Product[]> {
  const qs = search ? `?search=${encodeURIComponent(search)}` : "";
  const res = await apiGet<Product[]>(`/api/products${qs}`);
  if (res.error) throw new Error(res.error);
  return res.data ?? [];
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
