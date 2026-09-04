import { Hono } from "hono";
import { notificationsController } from "./notification.controller";
import { authMiddleware } from "../../middleware/auth";
import { resolveUser } from "../../middleware/resolve-user";
import type { JwtPayload } from "../../lib/jwt";

const notificationsRoutes = new Hono();

notificationsRoutes.use("*", authMiddleware, resolveUser);

notificationsRoutes.get("/", (c) => notificationsController.getUserNotifications(c));
notificationsRoutes.get("/:id", (c) => notificationsController.getNotification(c));
notificationsRoutes.post("/", async (c, next) => {
  const user = c.get("jwtPayload") as JwtPayload;
  if (user.role !== "admin") {
    return c.json({ error: "Unauthorized" }, 403);
  }
  return notificationsController.createNotification(c);
});
notificationsRoutes.patch("/:id/read", (c) => notificationsController.markAsRead(c));
notificationsRoutes.patch("/read-all", (c) => notificationsController.markAllAsRead(c));
notificationsRoutes.delete("/:id", (c) => notificationsController.deleteNotification(c));

export default notificationsRoutes;
