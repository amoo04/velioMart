import { db } from "../../db";
import { users, orders, products, adminLogs } from "../../db/schema";
import { eq, count, sum, sql, desc } from "drizzle-orm";

export const adminRepository = {
  async findAllUsers() {
    try {
      return await db
        .select({
          uuid: users.uuid,
          name: users.name,
          email: users.email,
          phone: users.phone,
          address: users.address,
          role: users.role,
          createdAt: users.createdAt,
        })
        .from(users)
        .orderBy(desc(users.createdAt));
    } catch (error) {
      throw new Error(`Failed to fetch users: ${error}`);
    }
  },

  async countAdmins() {
    try {
      const result = await db.select({ count: count() }).from(users).where(eq(users.role, "admin"));
      return result[0]?.count ?? 0;
    } catch (error) {
      throw new Error(`Failed to count admins: ${error}`);
    }
  },

  async updateUserRole(uuid: string, role: string) {
    try {
      const result = await db.update(users).set({ role }).where(eq(users.uuid, uuid)).returning();
      return result[0] ?? null;
    } catch (error) {
      throw new Error(`Failed to update user role: ${error}`);
    }
  },

  // Total number of registered users (shown on dashboard stats card)
  async findUsersCount() {
    try {
      const result = await db.select({ count: count() }).from(users);
      return result[0]?.count ?? 0;
    } catch (error) {
      throw new Error(`Failed to count users: ${error}`);
    }
  },

  // Sum of all order amounts where payment was successful (actual money earned)
  async findRevenue() {
    try {
      const result = await db
        .select({ total: sum(orders.total_amount) })
        .from(orders)
        .where(eq(orders.payment_status, "success"));
      return result[0]?.total ?? 0;
    } catch (error) {
      throw new Error(`Failed to calculate revenue: ${error}`);
    }
  },

  // Count orders — optionally filtered by payment status
  async findOrdersCount(status?: string) {
    try {
      const query = db.select({ count: count() }).from(orders);
      if (status) {
        const filtered = await query.where(eq(orders.payment_status, status));
        return filtered[0]?.count ?? 0;
      }
      const result = await query;
      return result[0]?.count ?? 0;
    } catch (error) {
      throw new Error(`Failed to count orders: ${error}`);
    }
  },

  // Total number of products in the catalogue
  async findProductsCount() {
    try {
      const result = await db.select({ count: count() }).from(products);
      return result[0]?.count ?? 0;
    } catch (error) {
      throw new Error(`Failed to count products: ${error}`);
    }
  },

  // Products where stock is below a given threshold (e.g. < 10)
  async findLowStockProducts(threshold: number) {
    try {
      return await db
        .select()
        .from(products)
        .where(sql`${products.stock} < ${threshold}`);
    } catch (error) {
      throw new Error(`Failed to fetch low stock products: ${error}`);
    }
  },

  // Count of products that need restocking (for dashboard badge)
  async findLowStockCount(threshold: number) {
    try {
      const result = await db
        .select({ count: count() })
        .from(products)
        .where(sql`${products.stock} < ${threshold}`);
      return result[0]?.count ?? 0;
    } catch (error) {
      throw new Error(`Failed to count low stock products: ${error}`);
    }
  },

  // Orders still in "processing" state (not yet shipped/delivered)
  async findPendingOrdersCount() {
    try {
      const result = await db
        .select({ count: count() })
        .from(orders)
        .where(eq(orders.delivery_status, "processing"));
      return result[0]?.count ?? 0;
    } catch (error) {
      throw new Error(`Failed to count pending orders: ${error}`);
    }
  },

  // Fetch orders by their payment status (e.g. "pending", "success", "failed")
  async findByPaymentStatus(status: string) {
    try {
      return await db
        .select()
        .from(orders)
        .where(eq(orders.payment_status, status))
        .orderBy(desc(orders.created_at));
    } catch (error) {
      throw new Error(`Failed to fetch orders by payment status: ${error}`);
    }
  },

  // Latest N orders for the "recent orders" widget on the dashboard
  async findRecentOrders(limit: number) {
    try {
      return await db
        .select()
        .from(orders)
        .orderBy(desc(orders.created_at))
        .limit(limit);
    } catch (error) {
      throw new Error(`Failed to fetch recent orders: ${error}`);
    }
  },

  // Record an action performed by an admin (audit trail)
  async createLog(adminId: number, action: string) {
    try {
      const result = await db
        .insert(adminLogs)
        .values({ admin_id: adminId, action })
        .returning();
      return result[0];
    } catch (error) {
      throw new Error(`Failed to create admin log: ${error}`);
    }
  },

  // Retrieve the full audit log, newest first
  async findAllLogs() {
    try {
      return await db
        .select({
          id: adminLogs.id,
          admin_id: adminLogs.admin_id,
          admin_name: users.name,
          action: adminLogs.action,
          created_at: adminLogs.created_at,
        })
        .from(adminLogs)
        .leftJoin(users, eq(adminLogs.admin_id, users.id))
        .orderBy(desc(adminLogs.created_at));
    } catch (error) {
      throw new Error(`Failed to fetch admin logs: ${error}`);
    }
  },
};
