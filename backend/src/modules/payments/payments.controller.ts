import type { Context } from "hono";
import { paymentsService } from "./payments.service";
import { createPaymentSchema, updatePaymentStatusSchema } from "./payments.schema";
import type { ResolvedUser } from "../../middleware/resolve-user";

export const paymentsController = {
  async getUserPayments(c: Context) {
    try {
      const user = c.get("user") as ResolvedUser;
      const payments = await paymentsService.getUserPayments(String(user.id));
      return c.json(payments, 200);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },

  async getById(c: Context) {
    try {
      const user = c.get("user") as ResolvedUser;
      const paymentId = Number(c.req.param("id"));
      const payment = await paymentsService.getById(
        String(user.id),
        paymentId,
        user.role,
      );
      return c.json(payment, 200);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },

  async create(c: Context) {
    try {
      const user = c.get("user") as ResolvedUser;
      const body = await c.req.json();
      const parsed = createPaymentSchema.safeParse(body);
      if (!parsed.success) {
        return c.json({ error: parsed.error.issues }, 400);
      }
      const payment = await paymentsService.createPayment(String(user.id), parsed.data);
      return c.json(payment, 201);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },

  async updateStatus(c: Context) {
    try {
      const user = c.get("user") as ResolvedUser;
      const paymentId = Number(c.req.param("id"));
      const body = await c.req.json();
      const parsed = updatePaymentStatusSchema.safeParse(body);
      if (!parsed.success) {
        return c.json({ error: parsed.error.issues }, 400);
      }
      const payment = await paymentsService.updateStatus(
        String(user.id),
        paymentId,
        parsed.data,
        user.role,
      );
      return c.json(payment, 200);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },

  async getAllPayments(c: Context) {
    try {
      const user = c.get("user") as ResolvedUser;
      if (user.role !== "admin") {
        return c.json({ error: "Admin access required" }, 403);
      }
      const payments = await paymentsService.getAllPayments();
      return c.json(payments, 200);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },
};
