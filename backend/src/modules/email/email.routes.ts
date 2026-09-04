import { Hono } from "hono";
import { emailController } from "./email.controller";
import { authMiddleware } from "../../middleware/auth";
import { resolveUser } from "../../middleware/resolve-user";

const emailRoutes = new Hono();

emailRoutes.use("*", authMiddleware, resolveUser);

emailRoutes.post("/send", (c) => emailController.sendEmail(c));

export default emailRoutes;
