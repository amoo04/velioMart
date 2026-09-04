import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ShieldCheck, ShieldOff } from "lucide-react";
import { useUsersQuery } from "../../users/hooks/useUsers";
import { updateUserRole } from "../../admin/api/roles.api";
import { useAuth } from "../../../lib/auth-context";

export default function RolesPage() {
  const { data: users = [], isLoading } = useUsersQuery();
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: ({ uuid, role }: { uuid: string; role: "customer" | "admin" }) => updateUserRole(uuid, role),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "users"] }),
    onError: (err) => setError(err instanceof Error ? err.message : "Something went wrong"),
  });

  const handleToggle = (uuid: string, currentRole: string) => {
    setError(null);
    const nextRole = currentRole === "admin" ? "customer" : "admin";
    const verb = nextRole === "admin" ? "Promote this user to admin" : "Demote this admin to a customer";
    if (confirm(`${verb}?`)) {
      mutation.mutate({ uuid, role: nextRole });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif-brand text-2xl font-semibold text-brand-black">Roles & Permissions</h1>
        <p className="mt-1 text-sm text-gray-500">
          Vektar has two roles today: <span className="font-medium text-gray-700">Admin</span> (full access
          to this dashboard) and <span className="font-medium text-gray-700">Customer</span> (storefront
          only). Promote or demote accounts below.
        </p>
      </div>

      {error && (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-500">{error}</p>
      )}

      <div className="overflow-hidden rounded-xl bg-brand-black-soft">
        {isLoading ? (
          <p className="p-6 text-sm text-gray-400">Loading...</p>
        ) : users.length === 0 ? (
          <p className="p-6 text-sm text-gray-400">No users found.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="text-gray-500">
              <tr>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="px-5 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {users.map((user) => {
                const isSelf = user.uuid === currentUser?.uuid;
                const isAdmin = user.role === "admin";
                return (
                  <tr key={user.uuid}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2 font-medium text-white">
                        {isAdmin ? (
                          <ShieldCheck className="h-4 w-4 text-brand-gold" strokeWidth={1.75} />
                        ) : (
                          <ShieldOff className="h-4 w-4 text-gray-600" strokeWidth={1.75} />
                        )}
                        {user.name}
                        {isSelf && <span className="text-xs text-gray-500">(you)</span>}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-400">{user.email}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                          isAdmin ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => handleToggle(user.uuid, user.role)}
                        disabled={isSelf || mutation.isPending}
                        title={isSelf ? "You cannot change your own role" : undefined}
                        className="text-sm font-medium text-brand-gold hover:text-brand-gold-soft disabled:cursor-not-allowed disabled:text-gray-600"
                      >
                        {isAdmin ? "Demote to Customer" : "Promote to Admin"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
