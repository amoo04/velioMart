import { DollarSign, ShoppingCart, Clock, Package, AlertTriangle, Users } from "lucide-react";
import { useDashboardStats, useRecentOrders, useLowStockProducts } from "../hooks/useDashboard";
import StatCard from "../components/StatCard";
import DashboardWidget from "../components/DashboardWidget";
import StatusBadge from "../../../components/StatusBadge";
import { formatMoney, formatDate } from "../../../lib/format";

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: recentOrders = [], isLoading: ordersLoading } = useRecentOrders(5);
  const { data: lowStock = [], isLoading: lowStockLoading } = useLowStockProducts();

  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-serif-brand text-2xl font-semibold text-brand-black">Dashboard</h1>

      {statsLoading || !stats ? (
        <p className="text-sm text-gray-500">Loading stats...</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          <StatCard label="Revenue" value={`₦${formatMoney(Number(stats.revenue))}`} icon={DollarSign} color="green" />
          <StatCard label="Orders" value={String(stats.ordersCount)} icon={ShoppingCart} color="blue" />
          <StatCard label="Pending" value={String(stats.pendingOrdersCount)} icon={Clock} color="amber" />
          <StatCard label="Products" value={String(stats.productsCount)} icon={Package} color="amber" />
          <StatCard label="Low Stock" value={String(stats.lowStockCount)} icon={AlertTriangle} color="red" />
          <StatCard label="Users" value={String(stats.usersCount)} icon={Users} color="purple" />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardWidget title="Recent Orders">
          {ordersLoading ? (
            <p className="text-sm text-gray-400">Loading...</p>
          ) : recentOrders.length === 0 ? (
            <p className="text-sm text-gray-400">No orders yet.</p>
          ) : (
            <div className="flex flex-col divide-y divide-white/10">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium text-white">Order #{order.id}</p>
                    <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-200">₦{formatMoney(order.total_amount)}</span>
                    <StatusBadge status={order.delivery_status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </DashboardWidget>

        <DashboardWidget title="Low Stock Alerts" icon={AlertTriangle}>
          {lowStockLoading ? (
            <p className="text-sm text-gray-400">Loading...</p>
          ) : lowStock.length === 0 ? (
            <p className="text-sm text-gray-400">Nothing low on stock.</p>
          ) : (
            <div className="flex max-h-80 flex-col divide-y divide-white/10 overflow-y-auto">
              {lowStock.map((product) => (
                <div key={product.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <p className="truncate text-sm font-medium text-white">{product.name}</p>
                  <span className="shrink-0 text-sm font-medium text-brand-gold">
                    {product.stock} left
                  </span>
                </div>
              ))}
            </div>
          )}
        </DashboardWidget>
      </div>
    </div>
  );
}
