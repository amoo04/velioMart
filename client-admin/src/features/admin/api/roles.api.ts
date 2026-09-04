import { apiPatch } from "../../../lib/api";
import type { AdminUserRow } from "../../users/api/users.api";

export async function updateUserRole(uuid: string, role: "customer" | "admin"): Promise<AdminUserRow> {
  const res = await apiPatch<AdminUserRow>(`/api/admin/users/${uuid}/role`, { role });
  if (res.error) throw new Error(res.error);
  return res.data!;
}
