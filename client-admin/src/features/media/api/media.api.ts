import { apiGet, apiPatch, apiDelete, apiUpload } from "../../../lib/api";

export interface MediaItem {
  id: number;
  filename: string;
  url: string;
  altText: string | null;
  tags: string | null;
  mimeType: string;
  size: number;
  createdAt: string;
  updatedAt: string;
}

export interface MediaUpdateInput {
  altText?: string | null;
  tags?: string | null;
}

export async function fetchMedia(search?: string): Promise<MediaItem[]> {
  const qs = search ? `?search=${encodeURIComponent(search)}` : "";
  const res = await apiGet<MediaItem[]>(`/api/media${qs}`);
  if (res.error) throw new Error(res.error);
  return res.data ?? [];
}

export async function uploadMedia(file: File): Promise<MediaItem> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await apiUpload<MediaItem>("/api/media/upload", formData);
  if (res.error) throw new Error(res.error);
  return res.data!;
}

export async function updateMedia(id: number, data: MediaUpdateInput): Promise<MediaItem> {
  const res = await apiPatch<MediaItem>(`/api/media/${id}`, data);
  if (res.error) throw new Error(res.error);
  return res.data!;
}

export async function deleteMedia(id: number): Promise<void> {
  const res = await apiDelete(`/api/media/${id}`);
  if (res.error) throw new Error(res.error);
}
