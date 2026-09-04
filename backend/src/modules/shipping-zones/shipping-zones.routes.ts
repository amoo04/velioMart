import { Hono } from "hono";
import { shippingZonesController } from "./shipping-zones.controller";
import { authMiddleware } from "../../middleware/auth";
import { resolveUser } from "../../middleware/resolve-user";
import { adminMiddleware } from "../../middleware/admin";

const shippingZonesRoutes = new Hono();

shippingZonesRoutes.get("/", (c) => shippingZonesController.getAll(c));
shippingZonesRoutes.post("/", authMiddleware, resolveUser, adminMiddleware, (c) =>
  shippingZonesController.create(c),
);
shippingZonesRoutes.patch("/:id", authMiddleware, resolveUser, adminMiddleware, (c) =>
  shippingZonesController.update(c),
);
shippingZonesRoutes.patch("/:id/move", authMiddleware, resolveUser, adminMiddleware, (c) =>
  shippingZonesController.move(c),
);
shippingZonesRoutes.delete("/:id", authMiddleware, resolveUser, adminMiddleware, (c) =>
  shippingZonesController.remove(c),
);

export default shippingZonesRoutes;
