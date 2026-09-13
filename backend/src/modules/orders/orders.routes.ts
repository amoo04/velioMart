import { Hono } from "hono";
import { ordersController } from "./orders.controller";
import { authMiddleware } from "../../middleware/auth";
import { resolveUser } from "../../middleware/resolve-user";
import { adminMiddleware } from "../../middleware/admin";

const ordersRoutes = new Hono();

ordersRoutes.use("*", authMiddleware, resolveUser);

ordersRoutes.get("/", (c) => ordersController.getUserOrders(c));
ordersRoutes.get("/all", (c) => ordersController.getAllOrders(c));
ordersRoutes.get("/:id", (c) => ordersController.getById(c));
ordersRoutes.post("/", (c) => ordersController.create(c));
ordersRoutes.patch("/:id/payment", adminMiddleware, (c) => ordersController.updatePayment(c));
ordersRoutes.patch("/:id/delivery", adminMiddleware, (c) => ordersController.updateDelivery(c));

export default ordersRoutes;
