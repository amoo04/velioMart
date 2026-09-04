import { Hono } from "hono";
import type { Bindings } from "../../index";
import { mediaController } from "./media.controller";
import { authMiddleware } from "../../middleware/auth";
import { resolveUser } from "../../middleware/resolve-user";
import { adminMiddleware } from "../../middleware/admin";

const mediaRoutes = new Hono<{ Bindings: Bindings }>();

mediaRoutes.use("*", authMiddleware, resolveUser, adminMiddleware);

mediaRoutes.get("/", (c) => mediaController.getAll(c));
mediaRoutes.post("/upload", (c) => mediaController.upload(c));
mediaRoutes.patch("/:id", (c) => mediaController.update(c));
mediaRoutes.delete("/:id", (c) => mediaController.remove(c));

export default mediaRoutes;
