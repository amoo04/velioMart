export const tag = { name: "Payments", description: "Payment management (authenticated)" };

const paths: Record<string, any> = {
  "/api/payments": {
    get: {
      tags: ["Payments"],
      summary: "Get current user's payments",
      security: [{ bearerAuth: [] }],
      responses: { "200": { description: "User's payments" } },
    },
    post: {
      tags: ["Payments"],
      summary: "Initiate a payment",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["order_id"],
              properties: {
                order_id: { type: "integer", description: "Order ID" },
                payment_method: { type: "string", description: "Payment method (optional)" },
              },
            },
          },
        },
      },
      responses: { "201": { description: "Payment initiated" }, "400": { description: "Validation error" } },
    },
  },
  "/api/payments/all": {
    get: {
      tags: ["Payments"],
      summary: "Get all payments (admin scoped in controller)",
      security: [{ bearerAuth: [] }],
      responses: { "200": { description: "All payments" } },
    },
  },
  "/api/payments/{id}": {
    get: {
      tags: ["Payments"],
      summary: "Get payment by ID",
      security: [{ bearerAuth: [] }],
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
      responses: { "200": { description: "Payment details" }, "404": { description: "Not found" } },
    },
  },
  "/api/payments/{id}/status": {
    patch: {
      tags: ["Payments"],
      summary: "Update payment status",
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
      responses: { "200": { description: "Status updated" } },
    },
  },
};

export default paths;
