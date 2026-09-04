import type { Context } from "hono";
import { shippingZonesService } from "./shipping-zones.service";
import {
  createShippingZoneSchema,
  updateShippingZoneSchema,
  moveShippingZoneSchema,
} from "./shipping-zones.schema";

export const shippingZonesController = {
  async getAll(c: Context) {
    try {
      const zones = await shippingZonesService.getAll();
      return c.json(zones, 200);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },

  async create(c: Context) {
    try {
      const body = await c.req.json();
      const parsed = createShippingZoneSchema.safeParse(body);
      if (!parsed.success) {
        return c.json({ error: parsed.error.issues }, 400);
      }
      const zone = await shippingZonesService.create(parsed.data);
      return c.json(zone, 201);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },

  async update(c: Context) {
    try {
      const id = Number(c.req.param("id"));
      const body = await c.req.json();
      const parsed = updateShippingZoneSchema.safeParse(body);
      if (!parsed.success) {
        return c.json({ error: parsed.error.issues }, 400);
      }
      const zone = await shippingZonesService.update(id, parsed.data);
      return c.json(zone, 200);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },

  async remove(c: Context) {
    try {
      const id = Number(c.req.param("id"));
      await shippingZonesService.remove(id);
      return c.json({ message: "Shipping zone deleted" }, 200);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },

  async move(c: Context) {
    try {
      const id = Number(c.req.param("id"));
      const body = await c.req.json();
      const parsed = moveShippingZoneSchema.safeParse(body);
      if (!parsed.success) {
        return c.json({ error: parsed.error.issues }, 400);
      }
      const zone = await shippingZonesService.move(id, parsed.data.direction);
      return c.json(zone, 200);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },
};
