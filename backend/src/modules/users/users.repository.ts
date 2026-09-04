import { db } from "../../db";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";

export type UpdateUserInput = {
  name?: string;
  phone?: string;
  address?: string;
};

export const usersRepository = {
  async findById(id: number) {
    try {
      const result = await db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1);
      return result[0] ?? null;
    } catch (error) {
      throw new Error(`Failed to find user: ${error}`);
    }
  },

  async update(id: number, data: UpdateUserInput) {
    try {
      const result = await db
        .update(users)
        .set(data)
        .where(eq(users.id, id))
        .returning();
      return result[0] ?? null;
    } catch (error) {
      throw new Error(`Failed to update user: ${error}`);
    }
  },

  async findAll() {
    try {
      const result = await db.select().from(users);
      return result;
    } catch (error) {
      throw new Error(`Failed to fetch users: ${error}`);
    }
  },
};
