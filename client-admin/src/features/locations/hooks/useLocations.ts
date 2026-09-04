import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchLocations, createLocation, updateLocation, moveLocation, deleteLocation,
} from "../api/locations.api";
import type { LocationInput } from "../api/locations.api";

export function useLocationsQuery() {
  return useQuery({
    queryKey: ["locations"],
    queryFn: fetchLocations,
  });
}

export function useCreateLocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: LocationInput) => createLocation(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["locations"] }),
  });
}

export function useUpdateLocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<LocationInput> }) => updateLocation(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["locations"] }),
  });
}

export function useMoveLocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, direction }: { id: number; direction: "up" | "down" }) => moveLocation(id, direction),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["locations"] }),
  });
}

export function useDeleteLocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteLocation(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["locations"] }),
  });
}
