import { db } from "../../db";
import { categories } from "../../db/schema";
import { eq } from "drizzle-orm";

export type CreateCategoryData = {
  name: string;
  slug: string;
  description?: string | null;
  parentId?: number | null;
  sortOrder?: number;
  isActive?: boolean;
};

export type UpdateCategoryData = {
  name?: string;
  slug?: string;
  description?: string | null;
  parentId?: number | null;
  sortOrder?: number;
  isActive?: boolean;
};

export const categoriesRepository = {
  async findAll() {
    try {
      return await db.select().from(categories);
    } catch (error) {
      throw new Error(`Failed to fetch categories: ${error}`);
    }
  },

  async findById(id: number) {
    try {
      const result = await db
        .select()
        .from(categories)
        .where(eq(categories.id, id))
        .limit(1);
      return result[0] ?? null;
    } catch (error) {
      throw new Error(`Failed to fetch category: ${error}`);
    }
  },

  async findBySlug(slug: string) {
    try {
      const result = await db
        .select()
        .from(categories)
        .where(eq(categories.slug, slug))
        .limit(1);
      return result[0] ?? null;
    } catch (error) {
      throw new Error(`Failed to fetch category by slug: ${error}`);
    }
  },

  async create(data: CreateCategoryData) {
    try {
      const result = await db
        .insert(categories)
        .values({
          name: data.name,
          slug: data.slug,
          description: data.description ?? null,
          parentId: data.parentId ?? null,
          sortOrder: data.sortOrder ?? 0,
          isActive: data.isActive ?? true,
        })
        .returning();
      return result[0];
    } catch (error) {
      throw new Error(`Failed to create category: ${error}`);
    }
  },

  async update(id: number, data: UpdateCategoryData) {
    try {
      const updateData: Record<string, unknown> = {};
      if (data.name !== undefined) updateData.name = data.name;
      if (data.slug !== undefined) updateData.slug = data.slug;
      if (data.description !== undefined)
        updateData.description = data.description;
      if (data.parentId !== undefined) updateData.parentId = data.parentId;
      if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;
      if (data.isActive !== undefined) updateData.isActive = data.isActive;

      const result = await db
        .update(categories)
        .set(updateData)
        .where(eq(categories.id, id))
        .returning();
      return result[0] ?? null;
    } catch (error) {
      throw new Error(`Failed to update category: ${error}`);
    }
  },

  async delete(id: number) {
    try {
      const result = await db
        .delete(categories)
        .where(eq(categories.id, id))
        .returning();
      return result[0] ?? null;
    } catch (error) {
      throw new Error(`Failed to delete category: ${error}`);
    }
  },
};
