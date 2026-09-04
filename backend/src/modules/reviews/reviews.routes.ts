import { Hono } from "hono";
import { reviewsController } from "./reviews.controller";
import { authMiddleware } from "../../middleware/auth";
import { resolveUser } from "../../middleware/resolve-user";
import { adminMiddleware } from "../../middleware/admin";

const reviewsRoutes = new Hono();

reviewsRoutes.get("/", (c) => reviewsController.getForProduct(c));
reviewsRoutes.get("/all", authMiddleware, resolveUser, (c) => reviewsController.getAll(c));
reviewsRoutes.post("/", authMiddleware, resolveUser, (c) => reviewsController.create(c));
reviewsRoutes.patch("/:id/status", authMiddleware, resolveUser, adminMiddleware, (c) =>
  reviewsController.updateStatus(c),
);
reviewsRoutes.delete("/:id", authMiddleware, resolveUser, adminMiddleware, (c) => reviewsController.remove(c));

export default reviewsRoutes;
