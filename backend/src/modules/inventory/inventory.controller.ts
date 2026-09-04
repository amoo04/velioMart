import type { Context } from "hono";
import { inventoryService } from "./inventory.service";
import { createInventoryRecordSchema } from "./inventory.schema";
import type { ResolvedUser } from "../../middleware/resolve-user";

export const inventoryController = {
  async getAll(c: Context) {
    try {
      const user = c.get("user") as ResolvedUser;
      if (user.role !== "admin") {
        return c.json({ error: "Admin access required" }, 403);
      }
      const productId = c.req.query("productId")
        ? Number(c.req.query("productId"))
        : undefined;
      const records = await inventoryService.getAll(productId);
      return c.json(records, 200);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },

  async getByProduct(c: Context) {
    try {
      const user = c.get("user") as ResolvedUser;
      if (user.role !== "admin") {
        return c.json({ error: "Admin access required" }, 403);
      }
      const productId = Number(c.req.param("productId"));
      const records = await inventoryService.getByProduct(productId);
      return c.json(records, 200);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },

  async createRecord(c: Context) {
    try {
      const user = c.get("user") as ResolvedUser;
      if (user.role !== "admin") {
        return c.json({ error: "Admin access required" }, 403);
      }
      const body = await c.req.json();
      const parsed = createInventoryRecordSchema.safeParse(body);
      if (!parsed.success) {
        return c.json({ error: parsed.error.issues }, 400);
      }
      const record = await inventoryService.createRecord({
        ...parsed.data,
        updatedBy: user.id,
      });
      return c.json(record, 201);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },
};
