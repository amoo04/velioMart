import { cartsRepository } from "./carts.repository";
import type { AddCartItemInput } from "./carts.repository";

export const cartsService = {
  async getCart(userId: string) {
    const id = Number(userId);
    return cartsRepository.findByUserId(id);
  },

  async addItem(userId: string, data: Omit<AddCartItemInput, "userId">) {
    const id = Number(userId);
    const existing = await cartsRepository.findByUserAndProduct(
      id,
      data.productId,
    );
    if (existing) {
      return cartsRepository.updateQuantity(id, data.productId, {
        quantity: existing.quantity + data.quantity,
      });
    }
    return cartsRepository.addItem({ ...data, userId: id });
  },

  async updateQuantity(userId: string, productId: number, quantity: number) {
    const id = Number(userId);
    const item = await cartsRepository.findByUserAndProduct(id, productId);
    if (!item) {
      throw new Error("Item not found in cart");
    }
    return cartsRepository.updateQuantity(id, productId, { quantity });
  },

  async removeItem(userId: string, productId: number) {
    const id = Number(userId);
    const item = await cartsRepository.findByUserAndProduct(id, productId);
    if (!item) {
      throw new Error("Item not found in cart");
    }
    return cartsRepository.removeItem(id, productId);
  },

  async clearCart(userId: string) {
    const id = Number(userId);
    return cartsRepository.clearCart(id);
  },
};
