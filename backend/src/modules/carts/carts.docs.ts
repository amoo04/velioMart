export const tag = { name: "Carts", description: "Shopping cart management (authenticated)" };

const paths: Record<string, any> = {
  "/api/carts": {
    get: {
      tags: ["Carts"],
      summary: "Get current user's cart with items",
      security: [{ bearerAuth: [] }],
      responses: { "200": { description: "Cart with items" } },
    },
    post: {
      tags: ["Carts"],
      summary: "Add item to cart",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["productId", "quantity"],
              properties: {
                productId: { type: "integer", description: "Product ID" },
                quantity: { type: "integer", minimum: 1 },
              },
            },
          },
        },
      },
      responses: { "201": { description: "Item added" }, "400": { description: "Validation error" } },
    },
    delete: {
      tags: ["Carts"],
      summary: "Clear entire cart",
      security: [{ bearerAuth: [] }],
      responses: { "200": { description: "Cart cleared" } },
    },
  },
  "/api/carts/{productId}": {
    patch: {
      tags: ["Carts"],
      summary: "Update item quantity",
      security: [{ bearerAuth: [] }],
      parameters: [{ name: "productId", in: "path", required: true, schema: { type: "integer" } }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["quantity"],
              properties: { quantity: { type: "integer", minimum: 1 } },
            },
          },
        },
      },
      responses: { "200": { description: "Quantity updated" }, "404": { description: "Item not found" } },
    },
    delete: {
      tags: ["Carts"],
      summary: "Remove item from cart",
      security: [{ bearerAuth: [] }],
      parameters: [{ name: "productId", in: "path", required: true, schema: { type: "integer" } }],
      responses: { "200": { description: "Item removed" }, "404": { description: "Item not found" } },
    },
  },
};

export default paths;
