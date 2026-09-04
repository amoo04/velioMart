import { db } from "../../db";
import { reviews, users, products } from "../../db/schema";
import { eq, and, desc } from "drizzle-orm";

export type CreateReviewInput = {
  productId: number;
  userId: number;
  rating: number;
  comment?: string | null;
};

export const reviewsRepository = {
  async findAll(status?: string) {
    try {
      const query = db
        .select({
          id: reviews.id,
          product_id: reviews.product_id,
          product_name: products.name,
          user_id: reviews.user_id,
          customer_name: users.name,
          customer_email: users.email,
          rating: reviews.rating,
          comment: reviews.comment,
          status: reviews.status,
          created_at: reviews.created_at,
        })
        .from(reviews)
        .innerJoin(users, eq(reviews.user_id, users.id))
        .innerJoin(products, eq(reviews.product_id, products.id))
        .orderBy(desc(reviews.created_at));

      if (status) {
        return await query.where(eq(reviews.status, status));
      }
      return await query;
    } catch (error) {
      throw new Error(`Failed to fetch reviews: ${error}`);
    }
  },

  async findById(id: number) {
    try {
      const result = await db.select().from(reviews).where(eq(reviews.id, id)).limit(1);
      return result[0] ?? null;
    } catch (error) {
      throw new Error(`Failed to fetch review: ${error}`);
    }
  },

  async findByUserAndProduct(userId: number, productId: number) {
    try {
      const result = await db
        .select()
        .from(reviews)
        .where(and(eq(reviews.user_id, userId), eq(reviews.product_id, productId)))
        .limit(1);
      return result[0] ?? null;
    } catch (error) {
      throw new Error(`Failed to fetch review: ${error}`);
    }
  },

  async create(data: CreateReviewInput) {
    try {
      const result = await db
        .insert(reviews)
        .values({
          product_id: data.productId,
          user_id: data.userId,
          rating: data.rating,
          comment: data.comment ?? null,
        })
        .returning();
      return result[0];
    } catch (error) {
      throw new Error(`Failed to create review: ${error}`);
    }
  },

  async updateStatus(id: number, status: string) {
    try {
      const result = await db
        .update(reviews)
        .set({ status, updated_at: new Date() })
        .where(eq(reviews.id, id))
        .returning();
      return result[0] ?? null;
    } catch (error) {
      throw new Error(`Failed to update review status: ${error}`);
    }
  },

  async delete(id: number) {
    try {
      const result = await db.delete(reviews).where(eq(reviews.id, id)).returning();
      return result[0] ?? null;
    } catch (error) {
      throw new Error(`Failed to delete review: ${error}`);
    }
  },
};
