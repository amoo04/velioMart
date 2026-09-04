import { db } from "../../db";
import { payments } from "../../db/schema";
import { eq } from "drizzle-orm";

export type CreatePaymentInput = {
  userId: number;
  orderId: number;
  amount: number;
  paymentMethod?: string;
};

export const paymentsRepository = {
  async findByUserId(userId: number) {
    try {
      const result = await db
        .select()
        .from(payments)
        .where(eq(payments.user_id, userId));
      return result;
    } catch (error) {
      throw new Error(`Failed to fetch payments: ${error}`);
    }
  },

  async findById(id: number) {
    try {
      const result = await db
        .select()
        .from(payments)
        .where(eq(payments.id, id))
        .limit(1);
      return result[0] ?? null;
    } catch (error) {
      throw new Error(`Failed to fetch payment: ${error}`);
    }
  },

  async findByOrderId(orderId: number) {
    try {
      const result = await db
        .select()
        .from(payments)
        .where(eq(payments.order_id, orderId));
      return result;
    } catch (error) {
      throw new Error(`Failed to fetch payments by order: ${error}`);
    }
  },

  async findAll() {
    try {
      const result = await db.select().from(payments);
      return result;
    } catch (error) {
      throw new Error(`Failed to fetch all payments: ${error}`);
    }
  },

  async create(data: CreatePaymentInput) {
    try {
      const result = await db
        .insert(payments)
        .values({
          user_id: data.userId,
          order_id: data.orderId,
          amount: data.amount,
          payment_method: data.paymentMethod ?? null,
        })
        .returning();
      return result[0];
    } catch (error) {
      throw new Error(`Failed to create payment: ${error}`);
    }
  },

  async updateStatus(
    id: number,
    paymentStatus: string,
    transactionRef?: string,
  ) {
    try {
      const values: Record<string, any> = {
        payment_status: paymentStatus,
      };
      if (transactionRef !== undefined) {
        values.transaction_ref = transactionRef;
      }
      const result = await db
        .update(payments)
        .set(values)
        .where(eq(payments.id, id))
        .returning();
      return result[0] ?? null;
    } catch (error) {
      throw new Error(`Failed to update payment status: ${error}`);
    }
  },
};
