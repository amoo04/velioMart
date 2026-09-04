import { Hono } from "hono";
import { categoriesController } from "./categories.controller";
import { authMiddleware } from "../../middleware/auth";
import { resolveUser } from "../../middleware/resolve-user";
import { adminMiddleware } from "../../middleware/admin";

const categoriesRoutes = new Hono();

categoriesRoutes.get("/", (c) => categoriesController.getAll(c));
categoriesRoutes.get("/:id", (c) => categoriesController.getById(c));
categoriesRoutes.post("/", authMiddleware, resolveUser, adminMiddleware, (c) => categoriesController.create(c));
categoriesRoutes.patch("/:id", authMiddleware, resolveUser, adminMiddleware, (c) => categoriesController.update(c));
categoriesRoutes.delete("/:id", authMiddleware, resolveUser, adminMiddleware, (c) => categoriesController.remove(c));

export default categoriesRoutes;
