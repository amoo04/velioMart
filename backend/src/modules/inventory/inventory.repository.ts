import { db } from "../../db";
import { inventoryHistory } from "../../db/schema";
import { eq, desc } from "drizzle-orm";

export type CreateInventoryInput = {
  productId: number;
  previousStock: number;
  newStock: number;
  updatedBy: number;
};

export const inventoryRepository = {
  async findAll(productId?: number) {
    try {
      const conditions = [];
      if (productId) {
        conditions.push(eq(inventoryHistory.product_id, productId));
      }
      const query = db
        .select()
        .from(inventoryHistory)
        .orderBy(desc(inventoryHistory.created_at));
      const result = conditions.length > 0
        ? await query.where(conditions[0])
        : await query;
      return result;
    } catch (error) {
      throw new Error(`Failed to fetch inventory records: ${error}`);
    }
  },

  async findByProductId(productId: number) {
    try {
      const result = await db
        .select()
        .from(inventoryHistory)
        .where(eq(inventoryHistory.product_id, productId))
        .orderBy(desc(inventoryHistory.created_at));
      return result;
    } catch (error) {
      throw new Error(`Failed to fetch inventory records for product: ${error}`);
    }
  },

  async create(data: CreateInventoryInput) {
    try {
      const result = await db
        .insert(inventoryHistory)
        .values({
          product_id: data.productId,
          previous_stock: data.previousStock,
          new_stock: data.newStock,
          updated_by: data.updatedBy,
        })
        .returning();
      return result[0];
    } catch (error) {
      throw new Error(`Failed to create inventory record: ${error}`);
    }
  },
};
