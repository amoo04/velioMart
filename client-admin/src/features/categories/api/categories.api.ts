import { apiGet, apiPost, apiPatch, apiDelete } from "../../../lib/api";

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  parentId: number | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryInput {
  name: string;
  slug: string;
  description?: string | null;
  parentId?: number | null;
  sortOrder?: number;
  isActive?: boolean;
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await apiGet<Category[]>("/api/categories");
  if (res.error) throw new Error(res.error);
  return res.data ?? [];
}

export async function createCategory(data: CategoryInput): Promise<Category> {
  const res = await apiPost<Category>("/api/categories", data);
  if (res.error) throw new Error(res.error);
  return res.data!;
}

export async function updateCategory(id: number, data: Partial<CategoryInput>): Promise<Category> {
  const res = await apiPatch<Category>(`/api/categories/${id}`, data);
  if (res.error) throw new Error(res.error);
  return res.data!;
}

export async function deleteCategory(id: number): Promise<void> {
  const res = await apiDelete(`/api/categories/${id}`);
  if (res.error) throw new Error(res.error);
}
