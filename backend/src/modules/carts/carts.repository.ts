import { db } from "../../db";
import { cart } from "../../db/schema";
import { eq, and } from "drizzle-orm";

export type AddCartItemInput = {
  userId: number;
  productId: number;
  quantity: number;
};

export type UpdateCartQuantityInput = {
  quantity: number;
};

export const cartsRepository = {
  async findByUserId(userId: number) {
    try {
      const result = await db
        .select()
        .from(cart)
        .where(eq(cart.user_id, userId));
      return result;
    } catch (error) {
      throw new Error(`Failed to fetch cart: ${error}`);
    }
  },

  async findByUserAndProduct(userId: number, productId: number) {
    try {
      const result = await db
        .select()
        .from(cart)
        .where(and(eq(cart.user_id, userId), eq(cart.product_id, productId)))
        .limit(1);
      return result[0] ?? null;
    } catch (error) {
      throw new Error(`Failed to find cart item: ${error}`);
    }
  },

  async addItem(data: AddCartItemInput) {
    try {
      const result = await db
        .insert(cart)
        .values({
          user_id: data.userId,
          product_id: data.productId,
          quantity: data.quantity,
        })
        .returning();
      return result[0];
    } catch (error) {
      throw new Error(`Failed to add item to cart: ${error}`);
    }
  },

  async updateQuantity(
    userId: number,
    productId: number,
    data: UpdateCartQuantityInput,
  ) {
    try {
      const result = await db
        .update(cart)
        .set({ quantity: data.quantity })
        .where(and(eq(cart.user_id, userId), eq(cart.product_id, productId)))
        .returning();
      return result[0] ?? null;
    } catch (error) {
      throw new Error(`Failed to update cart quantity: ${error}`);
    }
  },

  async removeItem(userId: number, productId: number) {
    try {
      const result = await db
        .delete(cart)
        .where(and(eq(cart.user_id, userId), eq(cart.product_id, productId)))
        .returning();
      return result[0] ?? null;
    } catch (error) {
      throw new Error(`Failed to remove item from cart: ${error}`);
    }
  },

  async clearCart(userId: number) {
    try {
      await db
        .delete(cart)
        .where(eq(cart.user_id, userId));
    } catch (error) {
      throw new Error(`Failed to clear cart: ${error}`);
    }
  },
};
