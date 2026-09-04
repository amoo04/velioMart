import { apiGet, apiPatch } from "../../../lib/api";
import type { UserProfile } from "../slice/profileSlice";

export interface UpdateProfileInput {
  name?: string;
  phone?: string;
  address?: string;
}

export async function fetchProfile(): Promise<UserProfile> {
  const res = await apiGet<UserProfile>("/api/users/profile");
  if (res.error) throw new Error(res.error);
  return res.data!;
}

export async function updateProfile(data: UpdateProfileInput): Promise<UserProfile> {
  const res = await apiPatch<UserProfile>("/api/users/profile", data);
  if (res.error) throw new Error(res.error);
  return res.data!;
}
