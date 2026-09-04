import { useMemo, useState } from "react";
import { useUsersQuery } from "../../users/hooks/useUsers";
import { useAllOrdersQuery } from "../../orders/hooks/useOrders";
import SearchBar from "../../../components/SearchBar";
import { formatMoney, formatDate } from "../../../lib/format";

export default function CustomersPage() {
  const { data: users = [], isLoading } = useUsersQuery();
  const { data: orders = [] } = useAllOrdersQuery();
  const [search, setSearch] = useState("");

  const customers = useMemo(() => users.filter((u) => u.role !== "admin"), [users]);

  const statsByEmail = useMemo(() => {
    const map = new Map<string, { orders: number; totalSpent: number }>();
    for (const order of orders) {
      if (!order.customer_email) continue;
      const entry = map.get(order.customer_email) ?? { orders: 0, totalSpent: 0 };
      entry.orders += 1;
      if (order.payment_status === "success") entry.totalSpent += order.total_amount;
      map.set(order.customer_email, entry);
    }
    return map;
  }, [orders]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(
      (c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q),
    );
  }, [customers, search]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-serif-brand text-2xl font-semibold text-brand-black">Customers</h1>

      <SearchBar placeholder="Search customers by name or email..." onSearch={setSearch} />

      <div className="overflow-hidden rounded-xl bg-brand-black-soft">
        {isLoading ? (
          <p className="p-6 text-sm text-gray-400">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="p-6 text-sm text-gray-400">No customers found.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="text-gray-500">
              <tr>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Phone</th>
                <th className="px-5 py-3 font-medium">Orders</th>
                <th className="px-5 py-3 font-medium">Total Spent</th>
                <th className="px-5 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filtered.map((customer) => {
                const stats = statsByEmail.get(customer.email);
                return (
                  <tr key={customer.uuid}>
                    <td className="px-5 py-3 font-medium text-white">{customer.name}</td>
                    <td className="px-5 py-3 text-gray-400">{customer.email}</td>
                    <td className="px-5 py-3 text-gray-400">{customer.phone ?? "—"}</td>
                    <td className="px-5 py-3 text-gray-200">{stats?.orders ?? 0}</td>
                    <td className="px-5 py-3 text-gray-200">₦{formatMoney(stats?.totalSpent ?? 0)}</td>
                    <td className="px-5 py-3 text-gray-400">{formatDate(customer.createdAt)}</td>
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
