import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchShippingZones, createShippingZone, updateShippingZone, moveShippingZone, deleteShippingZone,
} from "../api/shipping-zones.api";
import type { ShippingZoneInput } from "../api/shipping-zones.api";

export function useShippingZonesQuery() {
  return useQuery({
    queryKey: ["shipping-zones"],
    queryFn: fetchShippingZones,
  });
}

export function useCreateShippingZone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ShippingZoneInput) => createShippingZone(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["shipping-zones"] }),
  });
}

export function useUpdateShippingZone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ShippingZoneInput> }) =>
      updateShippingZone(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["shipping-zones"] }),
  });
}

export function useMoveShippingZone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, direction }: { id: number; direction: "up" | "down" }) =>
      moveShippingZone(id, direction),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["shipping-zones"] }),
  });
}

export function useDeleteShippingZone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteShippingZone(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["shipping-zones"] }),
  });
}
