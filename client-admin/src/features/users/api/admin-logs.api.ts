import { apiGet } from "../../../lib/api";

export interface AdminLog {
  id: number;
  admin_id: number;
  admin_name: string | null;
  action: string;
  created_at: string;
}

export async function fetchAdminLogs(): Promise<AdminLog[]> {
  const res = await apiGet<AdminLog[]>("/api/admin/logs");
  if (res.error) throw new Error(res.error);
  return res.data ?? [];
}
