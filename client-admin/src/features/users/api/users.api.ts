import { apiGet } from "../../../lib/api";

export interface AdminUserRow {
  uuid: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  role: string;
  createdAt: string;
}

export async function fetchUsers(): Promise<AdminUserRow[]> {
  const res = await apiGet<AdminUserRow[]>("/api/admin/users");
  if (res.error) throw new Error(res.error);
  return res.data ?? [];
}
