import { db } from "../../db";
import { locations } from "../../db/schema";
import { eq, asc } from "drizzle-orm";

export type CreateLocationData = {
  name: string;
  code: string;
  isActive?: boolean;
  sortOrder?: number;
};

export type UpdateLocationData = {
  name?: string;
  code?: string;
  isActive?: boolean;
  sortOrder?: number;
};

export const locationsRepository = {
  async findAll() {
    try {
      return await db.select().from(locations).orderBy(asc(locations.sortOrder));
    } catch (error) {
      throw new Error(`Failed to fetch locations: ${error}`);
    }
  },

  async findById(id: number) {
    try {
      const result = await db.select().from(locations).where(eq(locations.id, id)).limit(1);
      return result[0] ?? null;
    } catch (error) {
      throw new Error(`Failed to fetch location: ${error}`);
    }
  },

  async create(data: CreateLocationData) {
    try {
      const result = await db
        .insert(locations)
        .values({
          name: data.name,
          code: data.code,
          isActive: data.isActive ?? true,
          sortOrder: data.sortOrder ?? 0,
        })
        .returning();
      return result[0];
    } catch (error) {
      throw new Error(`Failed to create location: ${error}`);
    }
  },

  async update(id: number, data: UpdateLocationData) {
    try {
      const updateData: Record<string, unknown> = { updatedAt: new Date() };
      if (data.name !== undefined) updateData.name = data.name;
      if (data.code !== undefined) updateData.code = data.code;
      if (data.isActive !== undefined) updateData.isActive = data.isActive;
      if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;

      const result = await db
        .update(locations)
        .set(updateData)
        .where(eq(locations.id, id))
        .returning();
      return result[0] ?? null;
    } catch (error) {
      throw new Error(`Failed to update location: ${error}`);
    }
  },

  async delete(id: number) {
    try {
      const result = await db.delete(locations).where(eq(locations.id, id)).returning();
      return result[0] ?? null;
    } catch (error) {
      throw new Error(`Failed to delete location: ${error}`);
    }
  },

  async setSortOrder(id: number, sortOrder: number) {
    try {
      const result = await db
        .update(locations)
        .set({ sortOrder, updatedAt: new Date() })
        .where(eq(locations.id, id))
        .returning();
      return result[0] ?? null;
    } catch (error) {
      throw new Error(`Failed to reorder location: ${error}`);
    }
  },
};
