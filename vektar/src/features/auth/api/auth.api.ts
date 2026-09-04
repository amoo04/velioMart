import { apiPost, apiPatch } from "../../../lib/api";

export interface AuthUser {
  uuid: string;
  name: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export interface RegisterResponse {
  token: string;
  user: AuthUser;
}

export interface RegisterParams {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: "customer" | "retailer";
}

export interface UpdateProfileResponse {
  uuid: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export async function login(data: { email: string; password: string }): Promise<LoginResponse> {
  const res = await apiPost<LoginResponse>("/api/auth/login", data);
  if (res.error) throw new Error(res.error);
  return res.data!;
}

export async function register(data: RegisterParams): Promise<RegisterResponse> {
  const res = await apiPost<RegisterResponse>("/api/auth/register", data);
  if (res.error) throw new Error(res.error);
  return res.data!;
}

export async function updateAuthProfile(data: { name?: string }): Promise<UpdateProfileResponse> {
  const res = await apiPatch<UpdateProfileResponse>("/api/auth/profile", data);
  if (res.error) throw new Error(res.error);
  return res.data!;
}

export async function changePassword(data: {
  currentPassword: string;
  newPassword: string;
}): Promise<{ message: string }> {
  const res = await apiPost<{ message: string }>("/api/auth/change-password", data);
  if (res.error) throw new Error(res.error);
  return res.data!;
}
