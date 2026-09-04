import type { Context } from "hono";
import { usersService } from "./users.service";
import { updateProfileSchema } from "./users.schema";
import type { ResolvedUser } from "../../middleware/resolve-user";

export const usersController = {
  async getProfile(c: Context) {
    try {
      const user = c.get("user") as ResolvedUser;
      const profile = await usersService.getProfile(String(user.id));
      return c.json(profile, 200);
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
      const profile = await usersService.updateProfile(String(user.id), parsed.data);
      return c.json(profile, 200);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },

  async getAllUsers(c: Context) {
    try {
      const users = await usersService.getAllUsers();
      return c.json(users, 200);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },
};
