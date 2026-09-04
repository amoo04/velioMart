import { reviewsRepository, type CreateReviewInput } from "./reviews.repository";

export const reviewsService = {
  async getAll(status?: string) {
    return reviewsRepository.findAll(status);
  },

  async getApprovedForProduct(productId: number) {
    const all = await reviewsRepository.findAll("approved");
    return all.filter((r) => r.product_id === productId);
  },

  async create(data: CreateReviewInput) {
    const existing = await reviewsRepository.findByUserAndProduct(data.userId, data.productId);
    if (existing) {
      throw new Error("You have already reviewed this product");
    }
    return reviewsRepository.create(data);
  },

  async updateStatus(id: number, status: string) {
    const review = await reviewsRepository.findById(id);
    if (!review) {
      throw new Error("Review not found");
    }
    return reviewsRepository.updateStatus(id, status);
  },

  async remove(id: number) {
    const review = await reviewsRepository.findById(id);
    if (!review) {
      throw new Error("Review not found");
    }
    return reviewsRepository.delete(id);
  },
};
