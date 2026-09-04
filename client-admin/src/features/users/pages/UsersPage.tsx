import { useUsersQuery } from "../hooks/useUsers";
import { formatDate } from "../../../lib/format";

export default function UsersPage() {
  const { data: users = [], isLoading } = useUsersQuery();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-serif-brand text-2xl font-semibold text-brand-black">Users</h1>

      <div className="overflow-hidden rounded-xl bg-brand-black-soft">
        {isLoading ? (
          <p className="p-6 text-sm text-gray-400">Loading...</p>
        ) : users.length === 0 ? (
          <p className="p-6 text-sm text-gray-400">No users yet.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="text-gray-500">
              <tr>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Phone</th>
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="px-5 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {users.map((user) => (
                <tr key={user.uuid}>
                  <td className="px-5 py-3 font-medium text-white">{user.name}</td>
                  <td className="px-5 py-3 text-gray-400">{user.email}</td>
                  <td className="px-5 py-3 text-gray-400">{user.phone ?? "—"}</td>
                  <td className="px-5 py-3 text-gray-200 capitalize">{user.role}</td>
                  <td className="px-5 py-3 text-gray-400">{formatDate(user.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
