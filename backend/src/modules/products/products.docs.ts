export const tag = { name: "Products", description: "Product catalog management" };

const paths: Record<string, any> = {
  "/api/products": {
    get: {
      tags: ["Products"],
      summary: "List all products",
      parameters: [
        { name: "categoryId", in: "query", schema: { type: "integer" }, description: "Filter by category" },
        { name: "status", in: "query", schema: { type: "string" }, description: "Filter by status" },
        { name: "search", in: "query", schema: { type: "string" }, description: "Search by name" },
      ],
      responses: {
        "200": { description: "List of products" },
      },
    },
    post: {
      tags: ["Products"],
      summary: "Create a new product",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name", "price"],
              properties: {
                name: { type: "string", minLength: 1 },
                description: { type: "string", nullable: true },
                price: { type: "integer", description: "Price in cents" },
                stock: { type: "integer", minimum: 0, default: 0 },
                category_id: { type: "integer", nullable: true },
                image_url: { type: "string", format: "uri", nullable: true },
                brand: { type: "string", nullable: true },
                status: { type: "string", default: "active" },
              },
            },
          },
        },
      },
      responses: {
        "201": { description: "Product created" },
        "400": { description: "Validation error" },
      },
    },
  },
  "/api/products/low-stock": {
    get: {
      tags: ["Products"],
      summary: "Get low stock products (auth required)",
      security: [{ bearerAuth: [] }],
      responses: {
        "200": { description: "Low stock products" },
      },
    },
  },
  "/api/products/{id}": {
    get: {
      tags: ["Products"],
      summary: "Get a single product",
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
      responses: {
        "200": { description: "Product details" },
        "404": { description: "Product not found" },
      },
    },
    patch: {
      tags: ["Products"],
      summary: "Update a product",
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                name: { type: "string" },
                description: { type: "string", nullable: true },
                price: { type: "integer" },
                stock: { type: "integer", minimum: 0 },
                category_id: { type: "integer", nullable: true },
                image_url: { type: "string", format: "uri", nullable: true },
                brand: { type: "string", nullable: true },
                status: { type: "string" },
              },
            },
          },
        },
      },
      responses: {
        "200": { description: "Product updated" },
        "404": { description: "Product not found" },
      },
    },
    delete: {
      tags: ["Products"],
      summary: "Delete a product",
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
      responses: {
        "200": { description: "Product deleted" },
        "404": { description: "Product not found" },
      },
    },
  },
};

export default paths;
