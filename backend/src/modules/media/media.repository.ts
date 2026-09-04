import { db } from "../../db";
import { media } from "../../db/schema";
import { eq, desc, or, ilike } from "drizzle-orm";

export type CreateMediaData = {
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  altText?: string | null;
  tags?: string | null;
};

export type UpdateMediaData = {
  altText?: string | null;
  tags?: string | null;
};

export const mediaRepository = {
  async findAll(search?: string) {
    try {
      const query = db.select().from(media).orderBy(desc(media.createdAt));
      if (search) {
        return await query.where(or(ilike(media.altText, `%${search}%`), ilike(media.tags, `%${search}%`)));
      }
      return await query;
    } catch (error) {
      throw new Error(`Failed to fetch media: ${error}`);
    }
  },

  async findById(id: number) {
    try {
      const result = await db.select().from(media).where(eq(media.id, id)).limit(1);
      return result[0] ?? null;
    } catch (error) {
      throw new Error(`Failed to fetch media item: ${error}`);
    }
  },

  async create(data: CreateMediaData) {
    try {
      const result = await db
        .insert(media)
        .values({
          filename: data.filename,
          url: data.url,
          mimeType: data.mimeType,
          size: data.size,
          altText: data.altText ?? null,
          tags: data.tags ?? null,
        })
        .returning();
      return result[0];
    } catch (error) {
      throw new Error(`Failed to save media item: ${error}`);
    }
  },

  async update(id: number, data: UpdateMediaData) {
    try {
      const updateData: Record<string, unknown> = { updatedAt: new Date() };
      if (data.altText !== undefined) updateData.altText = data.altText;
      if (data.tags !== undefined) updateData.tags = data.tags;

      const result = await db.update(media).set(updateData).where(eq(media.id, id)).returning();
      return result[0] ?? null;
    } catch (error) {
      throw new Error(`Failed to update media item: ${error}`);
    }
  },

  async delete(id: number) {
    try {
      const result = await db.delete(media).where(eq(media.id, id)).returning();
      return result[0] ?? null;
    } catch (error) {
      throw new Error(`Failed to delete media item: ${error}`);
    }
  },
};
