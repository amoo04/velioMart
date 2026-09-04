import type { MiddlewareHandler } from "hono";
import type { ResolvedUser } from "./resolve-user";

export const adminMiddleware: MiddlewareHandler = async (c, next) => {
  const user = c.get("user") as ResolvedUser;
  if (user.role !== "admin") {
    return c.json({ error: "Unauthorized: admin role required" }, 403);
  }
  await next();
};
