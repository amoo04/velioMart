export const tag = { name: "Users", description: "User profile management (authenticated)" };

const paths: Record<string, any> = {
  "/api/users/profile": {
    get: {
      tags: ["Users"],
      summary: "Get current user's profile",
      security: [{ bearerAuth: [] }],
      responses: { "200": { description: "User profile" } },
    },
    patch: {
      tags: ["Users"],
      summary: "Update current user's profile",
      security: [{ bearerAuth: [] }],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                name: { type: "string" },
                phone: { type: "string" },
                address: { type: "string" },
              },
            },
          },
        },
      },
      responses: { "200": { description: "Profile updated" } },
    },
  },
  "/api/users": {
    get: {
      tags: ["Users"],
      summary: "Get all users (admin only)",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "page", in: "query", schema: { type: "string" } },
        { name: "limit", in: "query", schema: { type: "string" } },
      ],
      responses: { "200": { description: "Paginated users list (admin)" }, "403": { description: "Forbidden" } },
    },
  },
};

export default paths;
