import { usersRepository } from "./users.repository";
import type { UpdateUserInput } from "./users.repository";

export const usersService = {
  async getProfile(userId: string) {
    const id = Number(userId);
    const user = await usersRepository.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    const { password, id: _id, ...userWithoutSensitive } = user;
    return userWithoutSensitive;
  },

  async updateProfile(userId: string, data: UpdateUserInput) {
    const id = Number(userId);
    const user = await usersRepository.update(id, data);
    if (!user) {
      throw new Error("User not found");
    }
    const { password, id: _id, ...userWithoutSensitive } = user;
    return userWithoutSensitive;
  },

  async getAllUsers() {
    const allUsers = await usersRepository.findAll();
    return allUsers.map(({ password, id: _id, ...user }) => user);
  },
};
