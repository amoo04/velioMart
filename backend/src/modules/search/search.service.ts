import { searchRepository, type SearchFilters } from "./search.repository";

export const searchService = {
  async search(filters: SearchFilters) {
    return searchRepository.searchProducts(filters);
  },
};
