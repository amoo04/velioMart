export const tag = { name: "Admin", description: "Admin-only dashboard and management endpoints" };

const paths: Record<string, any> = {
  "/api/admin/dashboard": {
    get: {
      tags: ["Admin"],
      summary: "Get dashboard overview",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "threshold", in: "query", schema: { type: "integer" }, description: "Stock threshold" },
        { name: "limit", in: "query", schema: { type: "integer", maximum: 100 }, description: "Result limit" },
      ],
      responses: { "200": { description: "Dashboard data" }, "403": { description: "Admin role required" } },
    },
  },
  "/api/admin/recent-orders": {
    get: {
      tags: ["Admin"],
      summary: "Get recent orders",
      security: [{ bearerAuth: [] }],
      responses: { "200": { description: "Recent orders" } },
    },
  },
  "/api/admin/users": {
    get: {
      tags: ["Admin"],
      summary: "Get all users",
      security: [{ bearerAuth: [] }],
      responses: { "200": { description: "All users" } },
    },
  },
  "/api/admin/payments/{status}": {
    get: {
      tags: ["Admin"],
      summary: "Get payments by status",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "status",
          in: "path",
          required: true,
          schema: { type: "string", enum: ["pending", "success", "failed"] },
        },
      ],
      responses: { "200": { description: "Payments filtered by status" } },
    },
  },
  "/api/admin/low-stock": {
    get: {
      tags: ["Admin"],
      summary: "Get low stock products",
      security: [{ bearerAuth: [] }],
      responses: { "200": { description: "Low stock products" } },
    },
  },
  "/api/admin/logs": {
    get: {
      tags: ["Admin"],
      summary: "Get audit logs",
      security: [{ bearerAuth: [] }],
      responses: { "200": { description: "Audit logs" } },
    },
    post: {
      tags: ["Admin"],
      summary: "Create audit log entry",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["action"],
              properties: { action: { type: "string", description: "Action description" } },
            },
          },
        },
      },
      responses: { "201": { description: "Log entry created" } },
    },
  },
};

export default paths;
