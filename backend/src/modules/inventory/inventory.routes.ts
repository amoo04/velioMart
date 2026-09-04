import { Hono } from "hono";
import { inventoryController } from "./inventory.controller";
import { authMiddleware } from "../../middleware/auth";
import { resolveUser } from "../../middleware/resolve-user";

const inventoryRoutes = new Hono();

inventoryRoutes.use("*", authMiddleware, resolveUser);

inventoryRoutes.get("/", (c) => inventoryController.getAll(c));
inventoryRoutes.get("/product/:productId", (c) => inventoryController.getByProduct(c));
inventoryRoutes.post("/", (c) => inventoryController.createRecord(c));

export default inventoryRoutes;
