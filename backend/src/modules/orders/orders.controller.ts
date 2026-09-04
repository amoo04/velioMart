import type { Context } from "hono";
import { ordersService } from "./orders.service";
import {
  createOrderSchema,
  updatePaymentStatusSchema,
  updateDeliveryStatusSchema,
} from "./orders.schema";
import type { ResolvedUser } from "../../middleware/resolve-user";

export const ordersController = {
  async getUserOrders(c: Context) {
    try {
      const user = c.get("user") as ResolvedUser;
      const orders = await ordersService.getUserOrders(String(user.id));
      return c.json(orders, 200);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },

  async getById(c: Context) {
    try {
      const user = c.get("user") as ResolvedUser;
      const orderId = Number(c.req.param("id"));
      const order = await ordersService.getById(String(user.id), orderId, user.role);
      return c.json(order, 200);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },

  async create(c: Context) {
    try {
      const user = c.get("user") as ResolvedUser;
      const body = await c.req.json();
      const parsed = createOrderSchema.safeParse(body);
      if (!parsed.success) {
        return c.json({ error: parsed.error.issues }, 400);
      }
      const order = await ordersService.createOrder(
        String(user.id),
        parsed.data.shipping_address,
        parsed.data.shipping_zone_id,
      );
      return c.json(order, 201);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },

  async updatePayment(c: Context) {
    try {
      const user = c.get("user") as ResolvedUser;
      const orderId = Number(c.req.param("id"));
      const body = await c.req.json();
      const parsed = updatePaymentStatusSchema.safeParse(body);
      if (!parsed.success) {
        return c.json({ error: parsed.error.issues }, 400);
      }
      const order = await ordersService.updatePayment(
        String(user.id),
        orderId,
        parsed.data,
        user.role,
      );
      return c.json(order, 200);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },

  async updateDelivery(c: Context) {
    try {
      const user = c.get("user") as ResolvedUser;
      const orderId = Number(c.req.param("id"));
      const body = await c.req.json();
      const parsed = updateDeliveryStatusSchema.safeParse(body);
      if (!parsed.success) {
        return c.json({ error: parsed.error.issues }, 400);
      }
      const order = await ordersService.updateDelivery(
        String(user.id),
        orderId,
        parsed.data,
        user.role,
      );
      return c.json(order, 200);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },

  async getAllOrders(c: Context) {
    try {
      const user = c.get("user") as ResolvedUser;
      if (user.role !== "admin") {
        return c.json({ error: "Admin access required" }, 403);
      }
      const orders = await ordersService.getAllOrders();
      return c.json(orders, 200);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },
};
