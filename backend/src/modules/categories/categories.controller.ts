import type { Context } from "hono";
import { categoriesService } from "./categories.service";
import { createCategorySchema, updateCategorySchema } from "./categories.schema";

export const categoriesController = {
  async getAll(c: Context) {
    try {
      const categories = await categoriesService.getAll();
      return c.json(categories, 200);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },

  async getById(c: Context) {
    try {
      const id = Number(c.req.param("id"));
      const category = await categoriesService.getById(id);
      return c.json(category, 200);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },

  async create(c: Context) {
    try {
      const body = await c.req.json();
      const parsed = createCategorySchema.safeParse(body);
      if (!parsed.success) {
        return c.json({ error: parsed.error.issues }, 400);
      }
      const category = await categoriesService.create(parsed.data);
      return c.json(category, 201);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },

  async update(c: Context) {
    try {
      const id = Number(c.req.param("id"));
      const body = await c.req.json();
      const parsed = updateCategorySchema.safeParse(body);
      if (!parsed.success) {
        return c.json({ error: parsed.error.issues }, 400);
      }
      const category = await categoriesService.update(id, parsed.data);
      return c.json(category, 200);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },

  async remove(c: Context) {
    try {
      const id = Number(c.req.param("id"));
      const category = await categoriesService.remove(id);
      return c.json(category, 200);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },
};
