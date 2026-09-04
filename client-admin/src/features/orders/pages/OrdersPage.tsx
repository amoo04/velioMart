import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAllOrdersQuery, useUpdateOrderPayment, useUpdateOrderDelivery } from "../hooks/useOrders";
import StatusSelect from "../components/StatusSelect";
import StatusBadge from "../../../components/StatusBadge";
import { formatMoney, formatDate } from "../../../lib/format";

const PAYMENT_STATUSES = ["pending", "success", "failed"];
const DELIVERY_STATUSES = ["processing", "shipped", "out_for_delivery", "delivered", "cancelled"];

const FILTERS = ["All", ...DELIVERY_STATUSES];

export default function OrdersPage() {
  const navigate = useNavigate();
  const { data: orders = [], isLoading, isError, error } = useAllOrdersQuery();
  const updatePayment = useUpdateOrderPayment();
  const updateDelivery = useUpdateOrderDelivery();
  const [filter, setFilter] = useState("All");

  const filtered = useMemo(() => {
    if (filter === "All") return orders;
    return orders.filter((o) => o.delivery_status === filter);
  }, [orders, filter]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-serif-brand text-2xl font-semibold text-brand-black">Orders</h1>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition ${
              filter === status
                ? "bg-brand-gold text-brand-black"
                : "bg-brand-black-soft text-gray-400 hover:text-gray-200"
            }`}
          >
            {status.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl bg-brand-black-soft">
        {isLoading ? (
          <p className="p-6 text-sm text-gray-400">Loading...</p>
        ) : isError ? (
          <p className="p-6 text-sm text-red-400">
            Failed to load orders: {error instanceof Error ? error.message : "Unknown error"}
          </p>
        ) : filtered.length === 0 ? (
          <p className="p-6 text-sm text-gray-400">No orders found.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="text-gray-500">
              <tr>
                <th className="px-5 py-3 font-medium">Order</th>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Total</th>
                <th className="px-5 py-3 font-medium">Payment</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filtered.map((order) => {
                const cancelled = order.delivery_status === "cancelled";
                return (
                  <tr
                    key={order.id}
                    onClick={() => navigate(`/orders/${order.id}`)}
                    className="cursor-pointer hover:bg-white/5"
                  >
                    <td className="px-5 py-3 font-medium text-white">
                      {order.order_code}
                      <span className="ml-2 text-xs text-gray-500">
                        {order.items.length} item{order.items.length === 1 ? "" : "s"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-400">{order.customer_email ?? "Guest"}</td>
                    <td className="px-5 py-3 text-gray-500">{formatDate(order.created_at)}</td>
                    <td className={`px-5 py-3 ${cancelled ? "text-gray-500 line-through" : "text-gray-200"}`}>
                      ₦{formatMoney(order.total_amount)}
                    </td>
                    <td className="px-5 py-3" onClick={(e) => e.stopPropagation()}>
                      <StatusSelect
                        value={order.payment_status}
                        options={PAYMENT_STATUSES}
                        disabled={updatePayment.isPending}
                        onChange={(payment_status) =>
                          updatePayment.mutate({ id: order.id, data: { payment_status } })
                        }
                      />
                    </td>
                    <td className="px-5 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={order.delivery_status} />
                        <StatusSelect
                          value={order.delivery_status}
                          options={DELIVERY_STATUSES}
                          disabled={updateDelivery.isPending}
                          onChange={(delivery_status) =>
                            updateDelivery.mutate({ id: order.id, data: { delivery_status } })
                          }
                        />
                      </div>
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
