import { Hono } from "hono";
import { cartsController } from "./carts.controller";
import { authMiddleware } from "../../middleware/auth";
import { resolveUser } from "../../middleware/resolve-user";

const cartsRoutes = new Hono();

cartsRoutes.use("*", authMiddleware, resolveUser);

cartsRoutes.get("/", (c) => cartsController.getCart(c));
cartsRoutes.post("/", (c) => cartsController.addItem(c));
cartsRoutes.patch("/:productId", (c) => cartsController.updateQuantity(c));
cartsRoutes.delete("/:productId", (c) => cartsController.removeItem(c));
cartsRoutes.delete("/", (c) => cartsController.clearCart(c));

export default cartsRoutes;
