import type { Context } from "hono";
import { authService } from "./auth.service";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  updateProfileSchema,
} from "./auth.schema";
import type { ResolvedUser } from "../../middleware/resolve-user";

export const authController = {
  async forgotPassword(c: Context) {
    try {
      const body = await c.req.json();
      const parsed = forgotPasswordSchema.safeParse(body);
      if (!parsed.success) {
        return c.json({ error: parsed.error.issues }, 400);
      }
      const result = await authService.forgotPassword(parsed.data.email);
      return c.json(result, 200);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },

  async resetPassword(c: Context) {
    try {
      const body = await c.req.json();
      const parsed = resetPasswordSchema.safeParse(body);
      if (!parsed.success) {
        return c.json({ error: parsed.error.issues }, 400);
      }
      const result = await authService.resetPassword(
        parsed.data.token,
        parsed.data.newPassword,
      );
      return c.json(result, 200);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },

  async changePassword(c: Context) {
    try {
      const user = c.get("user") as ResolvedUser;
      const body = await c.req.json();
      const parsed = changePasswordSchema.safeParse(body);
      if (!parsed.success) {
        return c.json({ error: parsed.error.issues }, 400);
      }
      const result = await authService.changePassword(
        String(user.id),
        parsed.data.currentPassword,
        parsed.data.newPassword,
      );
      return c.json(result, 200);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },

  async updateProfile(c: Context) {
    try {
      const user = c.get("user") as ResolvedUser;
      const body = await c.req.json();
      const parsed = updateProfileSchema.safeParse(body);
      if (!parsed.success) {
        return c.json({ error: parsed.error.issues }, 400);
      }
      const result = await authService.updateProfile(
        String(user.id),
        parsed.data,
      );
      return c.json(result, 200);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },
};
