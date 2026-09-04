import { Hono } from "hono";
import { imagesController } from "./images.controller";
import { authMiddleware } from "../../middleware/auth";
import { resolveUser } from "../../middleware/resolve-user";

const imagesRoutes = new Hono();

imagesRoutes.use("*", authMiddleware, resolveUser);

imagesRoutes.post("/upload", (c) => imagesController.uploadImage(c));

export default imagesRoutes;
