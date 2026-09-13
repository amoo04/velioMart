import { Hono } from "hono";
import { paymentsController } from "./payments.controller";
import { authMiddleware } from "../../middleware/auth";
import { resolveUser } from "../../middleware/resolve-user";
import { adminMiddleware } from "../../middleware/admin";

const paymentsRoutes = new Hono();

paymentsRoutes.use("*", authMiddleware, resolveUser);

paymentsRoutes.get("/", (c) => paymentsController.getUserPayments(c));
paymentsRoutes.get("/all", (c) => paymentsController.getAllPayments(c));
paymentsRoutes.get("/:id", (c) => paymentsController.getById(c));
paymentsRoutes.post("/", (c) => paymentsController.create(c));
paymentsRoutes.patch("/:id/status", adminMiddleware, (c) => paymentsController.updateStatus(c));

export default paymentsRoutes;
