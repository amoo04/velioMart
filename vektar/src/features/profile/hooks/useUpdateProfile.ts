import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { updateProfile } from "../api/profile.api";
import type { UpdateProfileInput } from "../api/profile.api";
import { setProfile } from "../slice/profileSlice";
import type { AppDispatch } from "../../../store-config/store";

export type { UpdateProfileInput } from "../api/profile.api";

export function useUpdateProfile() {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileInput) => updateProfile(data),
    onSuccess: (profile) => {
      dispatch(setProfile(profile));
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}
