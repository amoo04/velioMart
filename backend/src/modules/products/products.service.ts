import { productsRepository } from "./products.repository";
import type { CreateProductInput, UpdateProductInput, ProductFilters } from "./products.repository";

export const productsService = {
  async getAll(filters?: ProductFilters) {
    return productsRepository.findAll(filters);
  },

  async getById(id: number) {
    const product = await productsRepository.findById(id);
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  },

  async create(data: CreateProductInput) {
    return productsRepository.create(data);
  },

  async update(id: number, data: UpdateProductInput) {
    const product = await productsRepository.findById(id);
    if (!product) {
      throw new Error("Product not found");
    }
    return productsRepository.update(id, data);
  },

  async remove(id: number) {
    const product = await productsRepository.findById(id);
    if (!product) {
      throw new Error("Product not found");
    }
    return productsRepository.delete(id);
  },

  async adjustStock(id: number, quantity: number) {
    const product = await productsRepository.findById(id);
    if (!product) {
      throw new Error("Product not found");
    }
    const newStock = product.stock + quantity;
    if (newStock < 0) {
      throw new Error("Insufficient stock");
    }
    return productsRepository.updateStock(id, newStock);
  },

  async getLowStock(threshold: number) {
    return productsRepository.findLowStock(threshold);
  },
};
