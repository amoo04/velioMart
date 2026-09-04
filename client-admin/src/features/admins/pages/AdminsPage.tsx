import { useMemo } from "react";
import { ShieldCheck } from "lucide-react";
import { useUsersQuery, useAdminLogsQuery } from "../../users/hooks/useUsers";
import { formatDate } from "../../../lib/format";

function timeAgo(value: string): string {
  const diffMs = Date.now() - new Date(value).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function AdminsPage() {
  const { data: users = [], isLoading } = useUsersQuery();
  const { data: logs = [], isLoading: logsLoading } = useAdminLogsQuery();

  const admins = useMemo(() => users.filter((u) => u.role === "admin"), [users]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-serif-brand text-2xl font-semibold text-brand-black">Admins</h1>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="overflow-hidden rounded-xl bg-brand-black-soft lg:col-span-2">
          {isLoading ? (
            <p className="p-6 text-sm text-gray-400">Loading...</p>
          ) : admins.length === 0 ? (
            <p className="p-6 text-sm text-gray-400">No admins found.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="text-gray-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Phone</th>
                  <th className="px-5 py-3 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {admins.map((admin) => (
                  <tr key={admin.uuid}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2 font-medium text-white">
                        <ShieldCheck className="h-4 w-4 text-brand-gold" strokeWidth={1.75} />
                        {admin.name}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-400">{admin.email}</td>
                    <td className="px-5 py-3 text-gray-400">{admin.phone ?? "—"}</td>
                    <td className="px-5 py-3 text-gray-400">{formatDate(admin.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="rounded-xl bg-brand-black-soft p-5">
          <h2 className="font-serif-brand text-base font-semibold text-white">Recent Activity</h2>
          <div className="mt-4 flex flex-col gap-4">
            {logsLoading ? (
              <p className="text-sm text-gray-400">Loading...</p>
            ) : logs.length === 0 ? (
              <p className="text-sm text-gray-400">No activity logged yet.</p>
            ) : (
              logs.slice(0, 15).map((log) => (
                <div key={log.id} className="text-sm">
                  <p className="text-gray-200">
                    <span className="font-medium text-white">{log.admin_name ?? "Unknown"}</span>{" "}
                    {log.action}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">{timeAgo(log.created_at)}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
