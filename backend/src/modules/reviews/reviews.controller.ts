import type { Context } from "hono";
import { reviewsService } from "./reviews.service";
import { createReviewSchema, updateReviewStatusSchema, reviewsQuerySchema } from "./reviews.schema";
import type { ResolvedUser } from "../../middleware/resolve-user";

export const reviewsController = {
  async getForProduct(c: Context) {
    try {
      const parsed = reviewsQuerySchema.safeParse(c.req.query());
      if (!parsed.success || !parsed.data.productId) {
        return c.json({ error: "productId is required" }, 400);
      }
      const reviews = await reviewsService.getApprovedForProduct(parsed.data.productId);
      return c.json(reviews, 200);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },

  async getAll(c: Context) {
    try {
      const user = c.get("user") as ResolvedUser;
      if (user.role !== "admin") {
        return c.json({ error: "Admin access required" }, 403);
      }
      const parsed = reviewsQuerySchema.safeParse(c.req.query());
      const status = parsed.success ? parsed.data.status : undefined;
      const reviews = await reviewsService.getAll(status);
      return c.json(reviews, 200);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },

  async create(c: Context) {
    try {
      const user = c.get("user") as ResolvedUser;
      const body = await c.req.json();
      const parsed = createReviewSchema.safeParse(body);
      if (!parsed.success) {
        return c.json({ error: parsed.error.issues }, 400);
      }
      const review = await reviewsService.create({
        productId: parsed.data.productId,
        userId: user.id,
        rating: parsed.data.rating,
        comment: parsed.data.comment,
      });
      return c.json(review, 201);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },

  async updateStatus(c: Context) {
    try {
      const id = Number(c.req.param("id"));
      const body = await c.req.json();
      const parsed = updateReviewStatusSchema.safeParse(body);
      if (!parsed.success) {
        return c.json({ error: parsed.error.issues }, 400);
      }
      const review = await reviewsService.updateStatus(id, parsed.data.status);
      return c.json(review, 200);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },

  async remove(c: Context) {
    try {
      const id = Number(c.req.param("id"));
      await reviewsService.remove(id);
      return c.json({ message: "Review deleted" }, 200);
    } catch (err: any) {
      return c.json({ error: err.message }, 400);
    }
  },
};
