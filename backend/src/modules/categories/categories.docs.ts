export const tag = { name: "Categories", description: "Product category management" };

const paths: Record<string, any> = {
  "/api/categories": {
    get: {
      tags: ["Categories"],
      summary: "List all categories",
      responses: { "200": { description: "List of categories" } },
    },
    post: {
      tags: ["Categories"],
      summary: "Create a category",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name", "slug"],
              properties: {
                name: { type: "string", minLength: 2 },
                slug: { type: "string", minLength: 2 },
                description: { type: "string", nullable: true },
                parentId: { type: "integer", nullable: true },
                sortOrder: { type: "integer", minimum: 0, default: 0 },
                isActive: { type: "boolean", default: true },
              },
            },
          },
        },
      },
      responses: { "201": { description: "Category created" }, "400": { description: "Validation error" } },
    },
  },
  "/api/categories/{id}": {
    get: {
      tags: ["Categories"],
      summary: "Get category by ID",
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
      responses: { "200": { description: "Category details" }, "404": { description: "Not found" } },
    },
    patch: {
      tags: ["Categories"],
      summary: "Update a category",
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                name: { type: "string", minLength: 2 },
                slug: { type: "string", minLength: 2 },
                description: { type: "string", nullable: true },
                parentId: { type: "integer", nullable: true },
                sortOrder: { type: "integer", minimum: 0 },
                isActive: { type: "boolean" },
              },
            },
          },
        },
      },
      responses: { "200": { description: "Category updated" }, "404": { description: "Not found" } },
    },
    delete: {
      tags: ["Categories"],
      summary: "Delete a category",
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
      responses: { "200": { description: "Category deleted" }, "404": { description: "Not found" } },
    },
  },
};

export default paths;
