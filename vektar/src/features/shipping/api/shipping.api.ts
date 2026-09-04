import { apiGet } from "../../../lib/api";

export interface ShippingZone {
  id: number;
  name: string;
  states: string;
  deliveryEstimate: string;
  rate: number;
  sortOrder: number;
}

export async function fetchShippingZones(): Promise<ShippingZone[]> {
  const res = await apiGet<ShippingZone[]>("/api/shipping-zones");
  if (res.error) throw new Error(res.error);
  return res.data ?? [];
}
