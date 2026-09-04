import { Hono } from "hono";
import { locationsController } from "./locations.controller";
import { authMiddleware } from "../../middleware/auth";
import { resolveUser } from "../../middleware/resolve-user";
import { adminMiddleware } from "../../middleware/admin";

const locationsRoutes = new Hono();

locationsRoutes.get("/", (c) => locationsController.getAll(c));
locationsRoutes.post("/", authMiddleware, resolveUser, adminMiddleware, (c) => locationsController.create(c));
locationsRoutes.patch("/:id", authMiddleware, resolveUser, adminMiddleware, (c) => locationsController.update(c));
locationsRoutes.patch("/:id/move", authMiddleware, resolveUser, adminMiddleware, (c) => locationsController.move(c));
locationsRoutes.delete("/:id", authMiddleware, resolveUser, adminMiddleware, (c) => locationsController.remove(c));

export default locationsRoutes;
