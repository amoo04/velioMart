import { Hono } from "hono";
import { usersController } from "./users.controller";
import { authMiddleware } from "../../middleware/auth";
import { resolveUser } from "../../middleware/resolve-user";
import type { JwtPayload } from "../../lib/jwt";

const usersRoutes = new Hono();

usersRoutes.use("*", authMiddleware, resolveUser);

usersRoutes.get("/profile", (c) => usersController.getProfile(c));
usersRoutes.patch("/profile", (c) => usersController.updateProfile(c));
usersRoutes.get("/", async (c, next) => {
  const user = c.get("jwtPayload") as JwtPayload;
  if (user.role !== "admin") {
    return c.json({ error: "Unauthorized" }, 403);
  }
  return usersController.getAllUsers(c);
});

export default usersRoutes;
