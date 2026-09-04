import { apiGet, apiPost, apiPatch, apiDelete } from "../../../lib/api";

export interface ShippingZone {
  id: number;
  name: string;
  states: string;
  deliveryEstimate: string;
  rate: number;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ShippingZoneInput {
  name: string;
  states: string;
  deliveryEstimate: string;
  rate: number;
  sortOrder?: number;
}

export async function fetchShippingZones(): Promise<ShippingZone[]> {
  const res = await apiGet<ShippingZone[]>("/api/shipping-zones");
  if (res.error) throw new Error(res.error);
  return res.data ?? [];
}

export async function createShippingZone(data: ShippingZoneInput): Promise<ShippingZone> {
  const res = await apiPost<ShippingZone>("/api/shipping-zones", data);
  if (res.error) throw new Error(res.error);
  return res.data!;
}

export async function updateShippingZone(
  id: number,
  data: Partial<ShippingZoneInput>,
): Promise<ShippingZone> {
  const res = await apiPatch<ShippingZone>(`/api/shipping-zones/${id}`, data);
  if (res.error) throw new Error(res.error);
  return res.data!;
}

export async function moveShippingZone(id: number, direction: "up" | "down"): Promise<ShippingZone> {
  const res = await apiPatch<ShippingZone>(`/api/shipping-zones/${id}/move`, { direction });
  if (res.error) throw new Error(res.error);
  return res.data!;
}

export async function deleteShippingZone(id: number): Promise<void> {
  const res = await apiDelete(`/api/shipping-zones/${id}`);
  if (res.error) throw new Error(res.error);
}
