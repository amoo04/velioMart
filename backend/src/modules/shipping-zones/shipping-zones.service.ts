import {
  shippingZonesRepository,
  type CreateShippingZoneData,
  type UpdateShippingZoneData,
} from "./shipping-zones.repository";

export const shippingZonesService = {
  async getAll() {
    return shippingZonesRepository.findAll();
  },

  async create(data: CreateShippingZoneData) {
    if (data.sortOrder === undefined) {
      const all = await shippingZonesRepository.findAll();
      data.sortOrder = all.length > 0 ? Math.max(...all.map((z) => z.sortOrder)) + 1 : 0;
    }
    return shippingZonesRepository.create(data);
  },

  async update(id: number, data: UpdateShippingZoneData) {
    const zone = await shippingZonesRepository.findById(id);
    if (!zone) {
      throw new Error("Shipping zone not found");
    }
    return shippingZonesRepository.update(id, data);
  },

  async remove(id: number) {
    const zone = await shippingZonesRepository.findById(id);
    if (!zone) {
      throw new Error("Shipping zone not found");
    }
    return shippingZonesRepository.delete(id);
  },

  async move(id: number, direction: "up" | "down") {
    const all = await shippingZonesRepository.findAll();
    const index = all.findIndex((z) => z.id === id);
    if (index === -1) {
      throw new Error("Shipping zone not found");
    }

    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= all.length) {
      return all[index];
    }

    const current = all[index];
    const neighbor = all[swapIndex];

    await shippingZonesRepository.setSortOrder(current.id, neighbor.sortOrder);
    await shippingZonesRepository.setSortOrder(neighbor.id, current.sortOrder);

    return shippingZonesRepository.findById(current.id);
  },
};
