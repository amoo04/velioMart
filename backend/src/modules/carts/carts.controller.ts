import type { Context } from "hono";
import { cartsService } from "./carts.service";
import { addCartItemSchema, updateCartQuantitySchema } from "./carts.schema";
import type { ResolvedUser } from "../../middleware/resolve-user";

export const cartsController = {
  async getCart(c: Context) {
    try {
      const user = c.get("user") as ResolvedUser;
      const items = await cartsService.getCart(String(user.id));
      return c.json(items, 200);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },

  async addItem(c: Context) {
    try {
      const user = c.get("user") as ResolvedUser;
      const body = await c.req.json();
      const parsed = addCartItemSchema.safeParse(body);
      if (!parsed.success) {
        return c.json({ error: parsed.error.issues }, 400);
      }
      const item = await cartsService.addItem(String(user.id), parsed.data);
      return c.json(item, 201);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },

  async updateQuantity(c: Context) {
    try {
      const user = c.get("user") as ResolvedUser;
      const productId = Number(c.req.param("productId"));
      const body = await c.req.json();
      const parsed = updateCartQuantitySchema.safeParse(body);
      if (!parsed.success) {
        return c.json({ error: parsed.error.issues }, 400);
      }
      const item = await cartsService.updateQuantity(
        String(user.id),
        productId,
        parsed.data.quantity,
      );
      return c.json(item, 200);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },

  async removeItem(c: Context) {
    try {
      const user = c.get("user") as ResolvedUser;
      const productId = Number(c.req.param("productId"));
      const item = await cartsService.removeItem(String(user.id), productId);
      return c.json(item, 200);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },

  async clearCart(c: Context) {
    try {
      const user = c.get("user") as ResolvedUser;
      await cartsService.clearCart(String(user.id));
      return c.json({ message: "Cart cleared" }, 200);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },
};
