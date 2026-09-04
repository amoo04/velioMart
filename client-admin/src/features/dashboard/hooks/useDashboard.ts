import { useQuery } from "@tanstack/react-query";
import { fetchDashboardStats, fetchRecentOrders, fetchLowStockProducts } from "../api/dashboard.api";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: fetchDashboardStats,
  });
}

export function useRecentOrders(limit = 10) {
  return useQuery({
    queryKey: ["admin", "recent-orders", limit],
    queryFn: () => fetchRecentOrders(limit),
  });
}

export function useLowStockProducts(threshold = 10) {
  return useQuery({
    queryKey: ["admin", "low-stock", threshold],
    queryFn: () => fetchLowStockProducts(threshold),
  });
}
