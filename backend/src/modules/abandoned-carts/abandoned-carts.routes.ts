import { Hono } from "hono";
import { abandonedCartsController } from "./abandoned-carts.controller";
import { authMiddleware } from "../../middleware/auth";
import { resolveUser } from "../../middleware/resolve-user";
import { adminMiddleware } from "../../middleware/admin";

const abandonedCartsRoutes = new Hono();

abandonedCartsRoutes.use("*", authMiddleware, resolveUser, adminMiddleware);

abandonedCartsRoutes.get("/", (c) => abandonedCartsController.getSummary(c));
abandonedCartsRoutes.post("/process", (c) => abandonedCartsController.processReminders(c));
abandonedCartsRoutes.delete("/:userId", (c) => abandonedCartsController.removeCart(c));

export default abandonedCartsRoutes;
