import {
  locationsRepository,
  type CreateLocationData,
  type UpdateLocationData,
} from "./locations.repository";

export const locationsService = {
  async getAll() {
    return locationsRepository.findAll();
  },

  async create(data: CreateLocationData) {
    if (data.sortOrder === undefined) {
      const all = await locationsRepository.findAll();
      data.sortOrder = all.length > 0 ? Math.max(...all.map((l) => l.sortOrder)) + 1 : 0;
    }
    return locationsRepository.create(data);
  },

  async update(id: number, data: UpdateLocationData) {
    const location = await locationsRepository.findById(id);
    if (!location) {
      throw new Error("Location not found");
    }
    return locationsRepository.update(id, data);
  },

  async remove(id: number) {
    const location = await locationsRepository.findById(id);
    if (!location) {
      throw new Error("Location not found");
    }
    return locationsRepository.delete(id);
  },

  async move(id: number, direction: "up" | "down") {
    const all = await locationsRepository.findAll();
    const index = all.findIndex((l) => l.id === id);
    if (index === -1) {
      throw new Error("Location not found");
    }

    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= all.length) {
      return all[index];
    }

    const current = all[index];
    const neighbor = all[swapIndex];

    await locationsRepository.setSortOrder(current.id, neighbor.sortOrder);
    await locationsRepository.setSortOrder(neighbor.id, current.sortOrder);

    return locationsRepository.findById(current.id);
  },
};
