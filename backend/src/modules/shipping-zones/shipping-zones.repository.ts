import { db } from "../../db";
import { shippingZones } from "../../db/schema";
import { eq, asc } from "drizzle-orm";

export type CreateShippingZoneData = {
  name: string;
  states: string;
  deliveryEstimate: string;
  rate: number;
  sortOrder?: number;
};

export type UpdateShippingZoneData = {
  name?: string;
  states?: string;
  deliveryEstimate?: string;
  rate?: number;
  sortOrder?: number;
};

export const shippingZonesRepository = {
  async findAll() {
    try {
      return await db.select().from(shippingZones).orderBy(asc(shippingZones.sortOrder));
    } catch (error) {
      throw new Error(`Failed to fetch shipping zones: ${error}`);
    }
  },

  async findById(id: number) {
    try {
      const result = await db
        .select()
        .from(shippingZones)
        .where(eq(shippingZones.id, id))
        .limit(1);
      return result[0] ?? null;
    } catch (error) {
      throw new Error(`Failed to fetch shipping zone: ${error}`);
    }
  },

  async create(data: CreateShippingZoneData) {
    try {
      const result = await db
        .insert(shippingZones)
        .values({
          name: data.name,
          states: data.states,
          deliveryEstimate: data.deliveryEstimate,
          rate: data.rate,
          sortOrder: data.sortOrder ?? 0,
        })
        .returning();
      return result[0];
    } catch (error) {
      throw new Error(`Failed to create shipping zone: ${error}`);
    }
  },

  async update(id: number, data: UpdateShippingZoneData) {
    try {
      const updateData: Record<string, unknown> = { updatedAt: new Date() };
      if (data.name !== undefined) updateData.name = data.name;
      if (data.states !== undefined) updateData.states = data.states;
      if (data.deliveryEstimate !== undefined) updateData.deliveryEstimate = data.deliveryEstimate;
      if (data.rate !== undefined) updateData.rate = data.rate;
      if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;

      const result = await db
        .update(shippingZones)
        .set(updateData)
        .where(eq(shippingZones.id, id))
        .returning();
      return result[0] ?? null;
    } catch (error) {
      throw new Error(`Failed to update shipping zone: ${error}`);
    }
  },

  async delete(id: number) {
    try {
      const result = await db.delete(shippingZones).where(eq(shippingZones.id, id)).returning();
      return result[0] ?? null;
    } catch (error) {
      throw new Error(`Failed to delete shipping zone: ${error}`);
    }
  },

  async setSortOrder(id: number, sortOrder: number) {
    try {
      const result = await db
        .update(shippingZones)
        .set({ sortOrder, updatedAt: new Date() })
        .where(eq(shippingZones.id, id))
        .returning();
      return result[0] ?? null;
    } catch (error) {
      throw new Error(`Failed to reorder shipping zone: ${error}`);
    }
  },
};
