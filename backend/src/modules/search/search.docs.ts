export const tag = { name: "Search", description: "Product search and filtering" };

const paths: Record<string, any> = {
  "/api/search": {
    get: {
      tags: ["Search"],
      summary: "Search and filter products",
      parameters: [
        { name: "query", in: "query", schema: { type: "string" }, description: "Search text" },
        { name: "categoryId", in: "query", schema: { type: "integer" }, description: "Filter by category" },
        { name: "minPrice", in: "query", schema: { type: "integer" }, description: "Minimum price in cents" },
        { name: "maxPrice", in: "query", schema: { type: "integer" }, description: "Maximum price in cents" },
        { name: "brand", in: "query", schema: { type: "string" }, description: "Filter by brand" },
        { name: "sortBy", in: "query", schema: { type: "string", enum: ["price", "created_at"] }, description: "Sort field" },
        { name: "order", in: "query", schema: { type: "string", enum: ["asc", "desc"] }, description: "Sort order" },
        { name: "page", in: "query", schema: { type: "integer" }, description: "Page number" },
        { name: "limit", in: "query", schema: { type: "integer", maximum: 100 }, description: "Items per page" },
      ],
      responses: { "200": { description: "Search results" } },
    },
  },
};

export default paths;
