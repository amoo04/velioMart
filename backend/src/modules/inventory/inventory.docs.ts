export const tag = { name: "Inventory", description: "Inventory tracking (authenticated)" };

const paths: Record<string, any> = {
  "/api/inventory": {
    get: {
      tags: ["Inventory"],
      summary: "Get all inventory records",
      security: [{ bearerAuth: [] }],
      responses: { "200": { description: "All inventory records" } },
    },
    post: {
      tags: ["Inventory"],
      summary: "Create inventory record",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["productId", "previousStock", "newStock"],
              properties: {
                productId: { type: "integer" },
                previousStock: { type: "integer" },
                newStock: { type: "integer" },
              },
            },
          },
        },
      },
      responses: { "201": { description: "Record created" } },
    },
  },
  "/api/inventory/product/{productId}": {
    get: {
      tags: ["Inventory"],
      summary: "Get inventory for a product",
      security: [{ bearerAuth: [] }],
      parameters: [{ name: "productId", in: "path", required: true, schema: { type: "integer" } }],
      responses: { "200": { description: "Inventory records for product" }, "404": { description: "Not found" } },
    },
  },
};

export default paths;
