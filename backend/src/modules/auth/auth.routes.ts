import { Hono } from "hono";
import { authController } from "./auth.controller";
import { authService } from "./auth.service";
import { authMiddleware } from "../../middleware/auth";
import { resolveUser } from "../../middleware/resolve-user";
import { loginSchema, registerSchema } from "./auth.schema";

const authRoutes = new Hono();

authRoutes.post("/register", async (c) => {
  const body = await c.req.json();
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: parsed.error.issues }, 400);
  }
  const { name, email, password, phone, address, role } = parsed.data;
  try {
    const user = await authService.register(name, email, password, phone, address, role);
    return c.json(user, 201);
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});

authRoutes.post("/login", async (c) => {
  const body = await c.req.json();
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: parsed.error.issues }, 400);
  }
  const { email, password } = parsed.data;
  try {
    const user = await authService.login(email, password);
    return c.json(user, 201);
  } catch (err: any) {
    return c.json({ error: err.message }, 401);
  }
});

authRoutes.post("/forgot-password", (c) => authController.forgotPassword(c));
authRoutes.post("/reset-password", (c) => authController.resetPassword(c));

authRoutes.use("/change-password", authMiddleware, resolveUser);
authRoutes.use("/profile", authMiddleware, resolveUser);

authRoutes.post("/change-password", (c) => authController.changePassword(c));
authRoutes.patch("/profile", (c) => authController.updateProfile(c));

export default authRoutes;
