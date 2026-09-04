import { adminRepository } from "./admin.repository";
import { authRepository } from "../auth/auth.repository";

// Default stock level below which a product is considered "low stock"
const LOW_STOCK_THRESHOLD = 10;

// ─── Business logic layer for admin operations ───
// Coordinates multiple repository calls, applies business rules,
// and returns structured data to the controller.

export const adminService = {
  // Gather all key metrics for the admin dashboard in one call.
  // Promise.all runs all DB queries in parallel for speed.
  async getDashboard() {
    const [
      usersCount,
      revenue,
      ordersCount,
      productsCount,
      lowStockCount,
      pendingOrdersCount,
    ] = await Promise.all([
      adminRepository.findUsersCount(),
      adminRepository.findRevenue(),
      adminRepository.findOrdersCount(),
      adminRepository.findProductsCount(),
      adminRepository.findLowStockCount(LOW_STOCK_THRESHOLD),
      adminRepository.findPendingOrdersCount(),
    ]);

    return {
      usersCount, // Total registered users
      revenue, // Total money from successful payments
      ordersCount, // Total orders placed
      productsCount, // Total products in catalogue
      lowStockCount, // Products that need restocking
      pendingOrdersCount, // Orders not yet shipped
    };
  },

  // Retrieve the full list of users (without passwords)
  async getUsers() {
    return adminRepository.findAllUsers();
  },

  // Promote/demote a user between "user" and "admin".
  // Guards against locking yourself out or leaving zero admins.
  async updateUserRole(actingAdminUuid: string, targetUuid: string, role: string) {
    if (actingAdminUuid === targetUuid) {
      throw new Error("You cannot change your own role");
    }
    const target = await authRepository.findByUuid(targetUuid);
    if (!target) {
      throw new Error("User not found");
    }
    if (role === "customer" && target.role === "admin") {
      const adminCount = await adminRepository.countAdmins();
      if (adminCount <= 1) {
        throw new Error("Cannot remove the last remaining admin");
      }
    }
    return adminRepository.updateUserRole(targetUuid, role);
  },

  // Get all orders matching a specific payment status
  // Used for filtering payments on the admin panel
  async getPaymentsByStatus(status: string) {
    return adminRepository.findByPaymentStatus(status);
  },

  // Get products with stock below the given threshold
  // Threshold can be overridden via query param, defaults to 10
  async getLowStock(threshold?: number) {
    return adminRepository.findLowStockProducts(
      threshold ?? LOW_STOCK_THRESHOLD,
    );
  },

  // Get the most recent orders for the dashboard widget
  async getRecentOrders(limit?: number) {
    return adminRepository.findRecentOrders(limit ?? 10);
  },

  // Log an admin action for audit trail
  async logAction(adminId: number, action: string) {
    return adminRepository.createLog(adminId, action);
  },

  // Retrieve the full audit log
  async getLogs() {
    return adminRepository.findAllLogs();
  },
};
