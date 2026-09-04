import type { Context } from "hono";
import { productsService } from "./products.service";
import { createProductSchema, updateProductSchema, productQuerySchema } from "./products.schema";
import type { ResolvedUser } from "../../middleware/resolve-user";

export const productsController = {
  async getAll(c: Context) {
    try {
      const query = c.req.query();
      const parsed = productQuerySchema.safeParse(query);
      const filters = parsed.success ? parsed.data : undefined;
      const products = await productsService.getAll(filters);
      return c.json(products, 200);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },

  async getById(c: Context) {
    try {
      const id = Number(c.req.param("id"));
      const product = await productsService.getById(id);
      return c.json(product, 200);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },

  async create(c: Context) {
    try {
      const body = await c.req.json();
      const parsed = createProductSchema.safeParse(body);
      if (!parsed.success) {
        return c.json({ error: parsed.error.issues }, 400);
      }
      const product = await productsService.create(parsed.data);
      return c.json(product, 201);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },

  async update(c: Context) {
    try {
      const id = Number(c.req.param("id"));
      const body = await c.req.json();
      const parsed = updateProductSchema.safeParse(body);
      if (!parsed.success) {
        return c.json({ error: parsed.error.issues }, 400);
      }
      const product = await productsService.update(id, parsed.data);
      return c.json(product, 200);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },

  async remove(c: Context) {
    try {
      const id = Number(c.req.param("id"));
      const product = await productsService.remove(id);
      return c.json(product, 200);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },

  async getLowStock(c: Context) {
    try {
      const user = c.get("user") as ResolvedUser;
      if (user.role !== "admin") {
        return c.json({ error: "Unauthorized" }, 403);
      }
      const threshold = Number(c.req.query("threshold")) || 10;
      const products = await productsService.getLowStock(threshold);
      return c.json(products, 200);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },
};
