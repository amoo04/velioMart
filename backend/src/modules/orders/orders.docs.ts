export const tag = { name: "Orders", description: "Order management (authenticated)" };

const paths: Record<string, any> = {
  "/api/orders": {
    get: {
      tags: ["Orders"],
      summary: "Get current user's orders",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "page", in: "query", schema: { type: "string" }, description: "Page number" },
        { name: "limit", in: "query", schema: { type: "string" }, description: "Items per page" },
      ],
      responses: { "200": { description: "Paginated orders" } },
    },
    post: {
      tags: ["Orders"],
      summary: "Create order from cart",
      security: [{ bearerAuth: [] }],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: { shipping_address: { type: "string", description: "Shipping address (optional)" } },
            },
          },
        },
      },
      responses: { "201": { description: "Order created" }, "400": { description: "Cart empty or error" } },
    },
  },
  "/api/orders/all": {
    get: {
      tags: ["Orders"],
      summary: "Get all orders (admin scoped in controller)",
      security: [{ bearerAuth: [] }],
      responses: { "200": { description: "All orders" } },
    },
  },
  "/api/orders/{id}": {
    get: {
      tags: ["Orders"],
      summary: "Get order by ID",
      security: [{ bearerAuth: [] }],
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
      responses: { "200": { description: "Order details" }, "404": { description: "Not found" } },
    },
  },
  "/api/orders/{id}/payment": {
    patch: {
      tags: ["Orders"],
      summary: "Update order payment status",
      security: [{ bearerAuth: [] }],
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["payment_status"],
              properties: {
                payment_status: { type: "string" },
                transaction_ref: { type: "string" },
              },
            },
          },
        },
      },
      responses: { "200": { description: "Payment status updated" } },
    },
  },
  "/api/orders/{id}/delivery": {
    patch: {
      tags: ["Orders"],
      summary: "Update order delivery status",
      security: [{ bearerAuth: [] }],
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["delivery_status"],
              properties: { delivery_status: { type: "string" } },
            },
          },
        },
      },
      responses: { "200": { description: "Delivery status updated" } },
    },
  },
};

export default paths;
