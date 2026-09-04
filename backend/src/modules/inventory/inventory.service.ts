import { inventoryRepository, type CreateInventoryInput } from "./inventory.repository";

export const inventoryService = {
  async getAll(productId?: number) {
    return inventoryRepository.findAll(productId);
  },

  async getByProduct(productId: number) {
    return inventoryRepository.findByProductId(productId);
  },

  async createRecord(data: CreateInventoryInput) {
    return inventoryRepository.create(data);
  },
};
