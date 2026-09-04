import { db } from "../../db";
import { products } from "../../db/schema";
import { eq, and, ilike, lt } from "drizzle-orm";

export type CreateProductInput = {
  name: string;
  description?: string | null;
  price: number;
  stock?: number;
  category_id?: number | null;
  image_url?: string | null;
  brand?: string | null;
  status?: string;
};

export type UpdateProductInput = {
  name?: string;
  description?: string | null;
  price?: number;
  stock?: number;
  category_id?: number | null;
  image_url?: string | null;
  brand?: string | null;
  status?: string;
};

export type ProductFilters = {
  categoryId?: number;
  status?: string;
  search?: string;
};

export const productsRepository = {
  async findAll(filters?: ProductFilters) {
    try {
      const conditions: any[] = [];
      if (filters?.categoryId) conditions.push(eq(products.category_id, filters.categoryId));
      if (filters?.status) conditions.push(eq(products.status, filters.status));
      if (filters?.search) conditions.push(ilike(products.name, `%${filters.search}%`));

      const result = await db
        .select()
        .from(products)
        .where(conditions.length > 0 ? and(...conditions) : undefined);
      return result;
    } catch (error) {
      throw new Error(`Failed to fetch products: ${error}`);
    }
  },

  async findById(id: number) {
    try {
      const result = await db
        .select()
        .from(products)
        .where(eq(products.id, id))
        .limit(1);
      return result[0] ?? null;
    } catch (error) {
      throw new Error(`Failed to fetch product: ${error}`);
    }
  },

  async create(data: CreateProductInput) {
    try {
      const result = await db
        .insert(products)
        .values({
          name: data.name,
          description: data.description ?? null,
          price: data.price,
          stock: data.stock ?? 0,
          category_id: data.category_id ?? null,
          image_url: data.image_url ?? null,
          brand: data.brand ?? null,
          status: data.status ?? "active",
        })
        .returning();
      return result[0];
    } catch (error) {
      throw new Error(`Failed to create product: ${error}`);
    }
  },

  async update(id: number, data: UpdateProductInput) {
    try {
      const updateData: Record<string, any> = {};
      if (data.name !== undefined) updateData.name = data.name;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.price !== undefined) updateData.price = data.price;
      if (data.stock !== undefined) updateData.stock = data.stock;
      if (data.category_id !== undefined) updateData.category_id = data.category_id;
      if (data.image_url !== undefined) updateData.image_url = data.image_url;
      if (data.brand !== undefined) updateData.brand = data.brand;
      if (data.status !== undefined) updateData.status = data.status;

      const result = await db
        .update(products)
        .set(updateData)
        .where(eq(products.id, id))
        .returning();
      return result[0] ?? null;
    } catch (error) {
      throw new Error(`Failed to update product: ${error}`);
    }
  },

  async delete(id: number) {
    try {
      const result = await db
        .delete(products)
        .where(eq(products.id, id))
        .returning();
      return result[0] ?? null;
    } catch (error) {
      throw new Error(`Failed to delete product: ${error}`);
    }
  },

  async updateStock(id: number, stock: number) {
    try {
      const result = await db
        .update(products)
        .set({ stock })
        .where(eq(products.id, id))
        .returning();
      return result[0] ?? null;
    } catch (error) {
      throw new Error(`Failed to update product stock: ${error}`);
    }
  },

  async findLowStock(threshold: number) {
    try {
      const result = await db
        .select()
        .from(products)
        .where(lt(products.stock, threshold));
      return result;
    } catch (error) {
      throw new Error(`Failed to fetch low stock products: ${error}`);
    }
  },
};
