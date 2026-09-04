import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "../api/users.api";
import { fetchAdminLogs } from "../api/admin-logs.api";

export function useUsersQuery() {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: fetchUsers,
  });
}

export function useAdminLogsQuery() {
  return useQuery({
    queryKey: ["admin", "logs"],
    queryFn: fetchAdminLogs,
  });
}
