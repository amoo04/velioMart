export const tag = { name: "Images", description: "Image upload (authenticated)" };

const paths: Record<string, any> = {
  "/api/images/upload": {
    post: {
      tags: ["Images"],
      summary: "Upload an image",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["filename"],
              properties: { filename: { type: "string", description: "Image filename" } },
            },
          },
        },
      },
      responses: { "201": { description: "Image uploaded" }, "400": { description: "Validation error" } },
    },
  },
};

export default paths;
