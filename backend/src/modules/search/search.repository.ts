import { db } from "../../db";
import { products } from "../../db/schema";
import { ilike, and, gte, lte, eq, or, desc, asc, sql } from "drizzle-orm";

export type SearchFilters = {
  query?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  status?: string;
  sortBy?: string;
  order?: string;
  page?: number;
  limit?: number;
};

export const searchRepository = {
  async searchProducts(filters: SearchFilters) {
    try {
      const conditions = [];

      if (filters.query) {
        conditions.push(
          or(
            ilike(products.name, `%${filters.query}%`),
            ilike(products.description ?? sql`''`, `%${filters.query}%`),
            ilike(products.brand ?? sql`''`, `%${filters.query}%`),
          ),
        );
      }

      if (filters.categoryId) {
        conditions.push(eq(products.category_id, filters.categoryId));
      }

      if (filters.minPrice !== undefined) {
        conditions.push(gte(products.price, filters.minPrice));
      }

      if (filters.maxPrice !== undefined) {
        conditions.push(lte(products.price, filters.maxPrice));
      }

      if (filters.brand) {
        conditions.push(eq(products.brand, filters.brand));
      }

      if (filters.status) {
        conditions.push(eq(products.status, filters.status));
      }

      const page = filters.page ?? 1;
      const limit = filters.limit ?? 20;
      const offset = (page - 1) * limit;

      const orderColumn = filters.sortBy === "price" ? products.price : products.created_at;
      const orderDir = filters.order === "asc" ? asc : desc;

      const query = db
        .select()
        .from(products)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(orderDir(orderColumn))
        .limit(limit)
        .offset(offset);

      const result = await query;

      const countResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(products)
        .where(conditions.length > 0 ? and(...conditions) : undefined);

      const total = Number(countResult[0]?.count ?? 0);

      return {
        items: result,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new Error(`Failed to search products: ${error}`);
    }
  },
};
