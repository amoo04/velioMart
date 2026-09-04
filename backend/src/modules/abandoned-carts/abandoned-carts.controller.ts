import type { Context } from "hono";
import { abandonedCartsService } from "./abandoned-carts.service";
import { abandonedCartsQuerySchema, processRemindersSchema } from "./abandoned-carts.schema";

export const abandonedCartsController = {
  async getSummary(c: Context) {
    try {
      const parsed = abandonedCartsQuerySchema.safeParse(c.req.query());
      const thresholdHours = parsed.success ? parsed.data.thresholdHours : undefined;
      const summary = await abandonedCartsService.getSummary(thresholdHours);
      return c.json(summary, 200);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },

  async processReminders(c: Context) {
    try {
      const body = await c.req.json().catch(() => ({}));
      const parsed = processRemindersSchema.safeParse(body);
      const thresholdHours = parsed.success ? parsed.data.thresholdHours : undefined;
      const result = await abandonedCartsService.processReminders(thresholdHours);
      return c.json(result, 200);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },

  async removeCart(c: Context) {
    try {
      const userId = Number(c.req.param("userId"));
      await abandonedCartsService.removeCart(userId);
      return c.json({ message: "Cart cleared" }, 200);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },
};
