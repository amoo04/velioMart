import { db } from "../../db";
import { cart, users, products, orders, cartReminders } from "../../db/schema";
import { eq, and, gt, desc } from "drizzle-orm";

export const abandonedCartsRepository = {
  async findActiveCartRows() {
    try {
      return await db
        .select({
          user_id: cart.user_id,
          email: users.email,
          name: users.name,
          product_id: cart.product_id,
          product_name: products.name,
          quantity: cart.quantity,
          price: products.price,
          created_at: cart.created_at,
        })
        .from(cart)
        .innerJoin(users, eq(cart.user_id, users.id))
        .innerJoin(products, eq(cart.product_id, products.id));
    } catch (error) {
      throw new Error(`Failed to fetch active cart rows: ${error}`);
    }
  },

  async findAllReminders() {
    try {
      return await db.select().from(cartReminders);
    } catch (error) {
      throw new Error(`Failed to fetch cart reminders: ${error}`);
    }
  },

  async findReminderByUser(userId: number) {
    try {
      const result = await db
        .select()
        .from(cartReminders)
        .where(eq(cartReminders.user_id, userId))
        .limit(1);
      return result[0] ?? null;
    } catch (error) {
      throw new Error(`Failed to fetch cart reminder: ${error}`);
    }
  },

  async upsertReminder(userId: number) {
    try {
      const existing = await this.findReminderByUser(userId);
      if (existing) {
        const result = await db
          .update(cartReminders)
          .set({
            remindedCount: existing.remindedCount + 1,
            lastRemindedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(cartReminders.id, existing.id))
          .returning();
        return result[0];
      }
      const result = await db
        .insert(cartReminders)
        .values({ user_id: userId, remindedCount: 1, lastRemindedAt: new Date() })
        .returning();
      return result[0];
    } catch (error) {
      throw new Error(`Failed to record cart reminder: ${error}`);
    }
  },

  async findFirstSuccessfulOrderAfter(userId: number, since: Date) {
    try {
      const result = await db
        .select()
        .from(orders)
        .where(
          and(eq(orders.user_id, userId), eq(orders.payment_status, "success"), gt(orders.created_at, since)),
        )
        .orderBy(desc(orders.created_at))
        .limit(1);
      return result[0] ?? null;
    } catch (error) {
      throw new Error(`Failed to check recovered orders: ${error}`);
    }
  },

  async clearUserCart(userId: number) {
    try {
      await db.delete(cart).where(eq(cart.user_id, userId));
    } catch (error) {
      throw new Error(`Failed to clear cart: ${error}`);
    }
  },
};
