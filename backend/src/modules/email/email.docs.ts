export const tag = { name: "Email", description: "Email sending (authenticated)" };

const paths: Record<string, any> = {
  "/api/email/send": {
    post: {
      tags: ["Email"],
      summary: "Send an email",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["to", "subject", "body"],
              properties: {
                to: { type: "string", format: "email" },
                subject: { type: "string" },
                body: { type: "string" },
              },
            },
          },
        },
      },
      responses: { "200": { description: "Email sent" }, "400": { description: "Validation error" } },
    },
  },
};

export default paths;
