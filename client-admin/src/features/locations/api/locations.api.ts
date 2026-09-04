import { apiGet, apiPost, apiPatch, apiDelete } from "../../../lib/api";

export interface Location {
  id: number;
  name: string;
  code: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface LocationInput {
  name: string;
  code: string;
  isActive?: boolean;
  sortOrder?: number;
}

export async function fetchLocations(): Promise<Location[]> {
  const res = await apiGet<Location[]>("/api/locations");
  if (res.error) throw new Error(res.error);
  return res.data ?? [];
}

export async function createLocation(data: LocationInput): Promise<Location> {
  const res = await apiPost<Location>("/api/locations", data);
  if (res.error) throw new Error(res.error);
  return res.data!;
}

export async function updateLocation(id: number, data: Partial<LocationInput>): Promise<Location> {
  const res = await apiPatch<Location>(`/api/locations/${id}`, data);
  if (res.error) throw new Error(res.error);
  return res.data!;
}

export async function moveLocation(id: number, direction: "up" | "down"): Promise<Location> {
  const res = await apiPatch<Location>(`/api/locations/${id}/move`, { direction });
  if (res.error) throw new Error(res.error);
  return res.data!;
}

export async function deleteLocation(id: number): Promise<void> {
  const res = await apiDelete(`/api/locations/${id}`);
  if (res.error) throw new Error(res.error);
}
