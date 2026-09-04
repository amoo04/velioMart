import { Hono } from "hono";
import { adminController } from "./admin.controller";
import { authMiddleware } from "../../middleware/auth";
import { resolveUser } from "../../middleware/resolve-user";
import type { JwtPayload } from "../../lib/jwt";

const adminRoutes = new Hono();

adminRoutes.use("*", authMiddleware, resolveUser);

// 2. Verify the user has admin role — reject with 403 if not
adminRoutes.use("*", async (c, next) => {
  const user = c.get("jwtPayload") as JwtPayload;
  if (user.role !== "admin") {
    return c.json({ error: "Unauthorized: admin role required" }, 403);
  }
  await next();
});

// ─── Dashboard & overview ───
adminRoutes.get("/dashboard", (c) => adminController.getDashboard(c));
adminRoutes.get("/recent-orders", (c) => adminController.getRecentOrders(c));

// ─── User management ───
adminRoutes.get("/users", (c) => adminController.getUsers(c));
adminRoutes.patch("/users/:id/role", (c) => adminController.updateUserRole(c));

// ─── Payment & order monitoring ───
adminRoutes.get("/payments/:status", (c) => adminController.getPaymentsByStatus(c));
adminRoutes.get("/low-stock", (c) => adminController.getLowStock(c));

// ─── Audit logging ───
adminRoutes.post("/logs", (c) => adminController.createLog(c));
adminRoutes.get("/logs", (c) => adminController.getLogs(c));

export default adminRoutes;
