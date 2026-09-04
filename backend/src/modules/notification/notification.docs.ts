export const tag = { name: "Notifications", description: "User notification management (authenticated)" };

const paths: Record<string, any> = {
  "/api/notifications": {
    get: {
      tags: ["Notifications"],
      summary: "Get user's notifications",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "is_read", in: "query", schema: { type: "string" }, description: "Filter by read status" },
      ],
      responses: { "200": { description: "User's notifications" } },
    },
    post: {
      tags: ["Notifications"],
      summary: "Create notification (admin only)",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["title", "message"],
              properties: {
                title: { type: "string" },
                message: { type: "string" },
              },
            },
          },
        },
      },
      responses: { "201": { description: "Notification created" }, "403": { description: "Admin role required" } },
    },
  },
  "/api/notifications/{id}": {
    get: {
      tags: ["Notifications"],
      summary: "Get notification by ID",
      security: [{ bearerAuth: [] }],
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
      responses: { "200": { description: "Notification details" }, "404": { description: "Not found" } },
    },
    delete: {
      tags: ["Notifications"],
      summary: "Delete a notification",
      security: [{ bearerAuth: [] }],
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
      responses: { "200": { description: "Notification deleted" } },
    },
  },
  "/api/notifications/{id}/read": {
    patch: {
      tags: ["Notifications"],
      summary: "Mark notification as read",
      security: [{ bearerAuth: [] }],
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
      responses: { "200": { description: "Marked as read" } },
    },
  },
  "/api/notifications/read-all": {
    patch: {
      tags: ["Notifications"],
      summary: "Mark all notifications as read",
      security: [{ bearerAuth: [] }],
      responses: { "200": { description: "All marked as read" } },
    },
  },
};

export default paths;
