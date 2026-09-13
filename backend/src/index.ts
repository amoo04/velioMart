import { Hono } from "hono";
import { cors } from "hono/cors";
import type { R2Bucket } from "@cloudflare/workers-types";
import { errorHandler } from "./lib/error";
import { serveAsset } from "./lib/assets";
import authRoutes from "./modules/auth/auth.routes";
import cartsRoutes from "./modules/carts/carts.routes";
import productsRoutes from "./modules/products/products.routes";
import categoriesRoutes from "./modules/categories/categories.routes";
import ordersRoutes from "./modules/orders/orders.routes";
import paymentsRoutes from "./modules/payments/payments.routes";
import notificationsRoutes from "./modules/notification/notification.routes";
import usersRoutes from "./modules/users/users.routes";
import adminRoutes from "./modules/admin/admin.routes";
import inventoryRoutes from "./modules/inventory/inventory.routes";
import emailRoutes from "./modules/email/email.routes";
import imagesRoutes from "./modules/images/images.routes";
import mediaRoutes from "./modules/media/media.routes";
import abandonedCartsRoutes from "./modules/abandoned-carts/abandoned-carts.routes";
import reviewsRoutes from "./modules/reviews/reviews.routes";
import searchRoutes from "./modules/search/search.routes";
import locationsRoutes from "./modules/locations/locations.routes";
import shippingZonesRoutes from "./modules/shipping-zones/shipping-zones.routes";
import docsRoutes from "./docs/index";

export type Bindings = {
  PRODUCT_IMAGES?: R2Bucket;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use(
  "/*",
  cors({
    origin: [
      "http://localhost:8081",
      "http://localhost:8082",
      "http://localhost:5173",
      "http://localhost:5174",
    ],
  }),
);
app.onError(errorHandler);

app.get("/static/*", (c) =>
  serveAsset(c, c.req.path.replace(/^\/static\//, "")),
);

app.get("/", (c) => {
  return c.json({ message: "E-Commerce API", version: "1.0.0" });
});

app.route("/docs", docsRoutes);
app.route("/api/auth", authRoutes);
app.route("/api/carts", cartsRoutes);
app.route("/api/products", productsRoutes);
app.route("/api/categories", categoriesRoutes);
app.route("/api/orders", ordersRoutes);
app.route("/api/payments", paymentsRoutes);
app.route("/api/notifications", notificationsRoutes);
app.route("/api/users", usersRoutes);
app.route("/api/admin", adminRoutes);
app.route("/api/inventory", inventoryRoutes);
app.route("/api/email", emailRoutes);
app.route("/api/images", imagesRoutes);
app.route("/api/media", mediaRoutes);
app.route("/api/admin/abandoned-carts", abandonedCartsRoutes);
app.route("/api/reviews", reviewsRoutes);
app.route("/api/search", searchRoutes);
app.route("/api/locations", locationsRoutes);
app.route("/api/shipping-zones", shippingZonesRoutes);

export default {
  port: 5000, // used by `bun run --hot` for local dev; ignored by Workers
  fetch: app.fetch,
};
