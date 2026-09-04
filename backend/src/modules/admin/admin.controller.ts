import type { Context } from "hono";
import { adminService } from "./admin.service";
import {
  createLogSchema,
  dashboardQuerySchema,
  paymentStatusSchema,
  updateUserRoleSchema,
} from "./admin.schema";
import type { ResolvedUser } from "../../middleware/resolve-user";

export const adminController = {
  async getDashboard(c: Context) {
    try {
      const dashboard = await adminService.getDashboard();
      return c.json(dashboard, 200);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },

  async getUsers(c: Context) {
    try {
      const users = await adminService.getUsers();
      return c.json(users, 200);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },

  async updateUserRole(c: Context) {
    try {
      const actingAdmin = c.get("user") as ResolvedUser;
      const targetUuid = c.req.param("id");
      const body = await c.req.json();
      const parsed = updateUserRoleSchema.safeParse(body);
      if (!parsed.success || !targetUuid) {
        return c.json({ error: parsed.success ? "Missing user id" : parsed.error.issues }, 400);
      }
      const updated = await adminService.updateUserRole(actingAdmin.uuid, targetUuid, parsed.data.role);
      return c.json(updated, 200);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },

  async getPaymentsByStatus(c: Context) {
    try {
      const status = c.req.param("status");
      const parsed = paymentStatusSchema.safeParse(status);
      if (!parsed.success) {
        return c.json(
          { error: "Status must be pending, success, or failed" },
          400,
        );
      }
      const orders = await adminService.getPaymentsByStatus(parsed.data);
      return c.json(orders, 200);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },

  async getLowStock(c: Context) {
    try {
      const query = dashboardQuerySchema.safeParse(c.req.query());
      const threshold = query.success ? query.data.threshold : undefined;
      const products = await adminService.getLowStock(threshold);
      return c.json(products, 200);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },

  async getRecentOrders(c: Context) {
    try {
      const query = dashboardQuerySchema.safeParse(c.req.query());
      const limit = query.success ? query.data.limit : undefined;
      const orders = await adminService.getRecentOrders(limit);
      return c.json(orders, 200);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },

  async createLog(c: Context) {
    try {
      const user = c.get("user") as ResolvedUser;
      const body = await c.req.json();
      const parsed = createLogSchema.safeParse(body);
      if (!parsed.success) {
        return c.json({ error: parsed.error.issues }, 400);
      }
      const log = await adminService.logAction(
        user.id,
        parsed.data.action,
      );
      return c.json(log, 201);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },

  async getLogs(c: Context) {
    try {
      const logs = await adminService.getLogs();
      return c.json(logs, 200);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },
};
