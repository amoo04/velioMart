import { db } from "../../db";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";

export type CreateUserInput = {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  role?: string;
};

export type UserPublic = {
  id: number;
  uuid: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
};

export const authRepository = {
  async findByEmail(email: string) {
    try {
      const result = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);
      return result[0] ?? null;
    } catch (error) {
      throw new Error(`Failed to find user by email: ${error}`);
    }
  },

  async create(data: CreateUserInput) {
    try {
      const result = await db.insert(users).values(data).returning({
        id: users.id,
        uuid: users.uuid,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
      });
      return result[0] as UserPublic;
    } catch (error) {
      throw new Error(`Failed to create user: ${error}`);
    }
  },

  async findById(id: number) {
    try {
      const result = await db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1);
      return result[0] ?? null;
    } catch (error) {
      throw new Error(`Failed to find user by id: ${error}`);
    }
  },

  async findByUuid(uuid: string) {
    try {
      const result = await db
        .select()
        .from(users)
        .where(eq(users.uuid, uuid))
        .limit(1);
      return result[0] ?? null;
    } catch (error) {
      throw new Error(`Failed to find user by uuid: ${error}`);
    }
  },

  async updatePassword(id: number, hashedPassword: string) {
    try {
      await db
        .update(users)
        .set({ password: hashedPassword })
        .where(eq(users.id, id));
    } catch (error) {
      throw new Error(`Failed to update password: ${error}`);
    }
  },

  async updateProfile(id: number, data: { name?: string }) {
    try {
      const result = await db
        .update(users)
        .set(data)
        .where(eq(users.id, id))
        .returning({
          id: users.id,
          uuid: users.uuid,
          name: users.name,
          email: users.email,
          role: users.role,
          createdAt: users.createdAt,
        });
      return result[0] ?? null;
    } catch (error) {
      throw new Error(`Failed to update profile: ${error}`);
    }
  },
};
