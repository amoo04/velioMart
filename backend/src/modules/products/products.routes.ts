import { Hono } from "hono";
import { productsController } from "./products.controller";
import { authMiddleware } from "../../middleware/auth";
import { resolveUser } from "../../middleware/resolve-user";
import { adminMiddleware } from "../../middleware/admin";

const productsRoutes = new Hono();

productsRoutes.get("/", (c) => productsController.getAll(c));
productsRoutes.get("/low-stock", authMiddleware, resolveUser, (c) => productsController.getLowStock(c));
productsRoutes.get("/:id", (c) => productsController.getById(c));
productsRoutes.post("/", authMiddleware, resolveUser, adminMiddleware, (c) => productsController.create(c));
productsRoutes.patch("/:id", authMiddleware, resolveUser, adminMiddleware, (c) => productsController.update(c));
productsRoutes.delete("/:id", authMiddleware, resolveUser, adminMiddleware, (c) => productsController.remove(c));

export default productsRoutes;
