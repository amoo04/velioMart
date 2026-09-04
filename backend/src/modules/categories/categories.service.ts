import { categoriesRepository, type CreateCategoryData, type UpdateCategoryData } from "./categories.repository";

export const categoriesService = {
  async getAll() {
    return categoriesRepository.findAll();
  },

  async getById(id: number) {
    const category = await categoriesRepository.findById(id);
    if (!category) {
      throw new Error("Category not found");
    }
    return category;
  },

  async create(data: CreateCategoryData) {
    return categoriesRepository.create(data);
  },

  async update(id: number, data: UpdateCategoryData) {
    const category = await categoriesRepository.findById(id);
    if (!category) {
      throw new Error("Category not found");
    }
    return categoriesRepository.update(id, data);
  },

  async remove(id: number) {
    const category = await categoriesRepository.findById(id);
    if (!category) {
      throw new Error("Category not found");
    }
    return categoriesRepository.delete(id);
  },
};
