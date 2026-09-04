import { apiGet } from "../../../lib/api";

export interface DashboardStats {
  usersCount: number;
  revenue: number;
  ordersCount: number;
  productsCount: number;
  lowStockCount: number;
  pendingOrdersCount: number;
}

export interface RecentOrder {
  id: number;
  user_id: number;
  total_amount: number;
  payment_status: string;
  delivery_status: string;
  created_at: string;
}

export interface LowStockProduct {
  id: number;
  name: string;
  stock: number;
  price: number;
  status: string;
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const res = await apiGet<DashboardStats>("/api/admin/dashboard");
  if (res.error) throw new Error(res.error);
  return res.data!;
}

export async function fetchRecentOrders(limit = 10): Promise<RecentOrder[]> {
  const res = await apiGet<RecentOrder[]>(`/api/admin/recent-orders?limit=${limit}`);
  if (res.error) throw new Error(res.error);
  return res.data ?? [];
}

export async function fetchLowStockProducts(threshold = 10): Promise<LowStockProduct[]> {
  const res = await apiGet<LowStockProduct[]>(`/api/admin/low-stock?threshold=${threshold}`);
  if (res.error) throw new Error(res.error);
  return res.data ?? [];
}
