import type { Context } from "hono";
import { locationsService } from "./locations.service";
import { createLocationSchema, updateLocationSchema, moveLocationSchema } from "./locations.schema";

export const locationsController = {
  async getAll(c: Context) {
    try {
      const locations = await locationsService.getAll();
      return c.json(locations, 200);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },

  async create(c: Context) {
    try {
      const body = await c.req.json();
      const parsed = createLocationSchema.safeParse(body);
      if (!parsed.success) {
        return c.json({ error: parsed.error.issues }, 400);
      }
      const location = await locationsService.create(parsed.data);
      return c.json(location, 201);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },

  async update(c: Context) {
    try {
      const id = Number(c.req.param("id"));
      const body = await c.req.json();
      const parsed = updateLocationSchema.safeParse(body);
      if (!parsed.success) {
        return c.json({ error: parsed.error.issues }, 400);
      }
      const location = await locationsService.update(id, parsed.data);
      return c.json(location, 200);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },

  async remove(c: Context) {
    try {
      const id = Number(c.req.param("id"));
      await locationsService.remove(id);
      return c.json({ message: "Location deleted" }, 200);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },

  async move(c: Context) {
    try {
      const id = Number(c.req.param("id"));
      const body = await c.req.json();
      const parsed = moveLocationSchema.safeParse(body);
      if (!parsed.success) {
        return c.json({ error: parsed.error.issues }, 400);
      }
      const location = await locationsService.move(id, parsed.data.direction);
      return c.json(location, 200);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },
};
