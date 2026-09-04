import type { Context } from "hono";
import type { Bindings } from "../../index";
import { mediaService } from "./media.service";
import { updateMediaSchema, mediaQuerySchema } from "./media.schema";

export const mediaController = {
  async getAll(c: Context<{ Bindings: Bindings }>) {
    try {
      const query = c.req.query();
      const parsed = mediaQuerySchema.safeParse(query);
      const search = parsed.success ? parsed.data.search : undefined;
      const items = await mediaService.getAll(search);
      return c.json(items, 200);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },

  async upload(c: Context<{ Bindings: Bindings }>) {
    try {
      const body = await c.req.parseBody();
      const file = body.file;
      if (!(file instanceof File)) {
        return c.json({ error: "No file provided" }, 400);
      }
      const item = await mediaService.upload(file, c.env?.PRODUCT_IMAGES);
      return c.json(item, 201);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },

  async update(c: Context<{ Bindings: Bindings }>) {
    try {
      const id = Number(c.req.param("id"));
      const body = await c.req.json();
      const parsed = updateMediaSchema.safeParse(body);
      if (!parsed.success) {
        return c.json({ error: parsed.error.issues }, 400);
      }
      const item = await mediaService.update(id, parsed.data);
      return c.json(item, 200);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },

  async remove(c: Context<{ Bindings: Bindings }>) {
    try {
      const id = Number(c.req.param("id"));
      await mediaService.remove(id, c.env?.PRODUCT_IMAGES);
      return c.json({ message: "Media item deleted" }, 200);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },
};
