import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchMedia, uploadMedia, updateMedia, deleteMedia } from "../api/media.api";
import type { MediaUpdateInput } from "../api/media.api";

export function useMediaQuery(search?: string) {
  return useQuery({
    queryKey: ["media", search ?? ""],
    queryFn: () => fetchMedia(search),
  });
}

export function useUploadMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => uploadMedia(file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["media"] }),
  });
}

export function useUpdateMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: MediaUpdateInput }) => updateMedia(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["media"] }),
  });
}

export function useDeleteMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteMedia(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["media"] }),
  });
}
