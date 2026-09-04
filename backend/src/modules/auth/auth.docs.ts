export const tag = { name: "Authentication", description: "User registration, login, password management" };

const paths: Record<string, any> = {
  "/api/auth/register": {
    post: {
      tags: ["Authentication"],
      summary: "Register a new user",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name", "email", "password"],
              properties: {
                name: { type: "string", minLength: 2, description: "User's full name" },
                email: { type: "string", format: "email", description: "Email address" },
                password: { type: "string", minLength: 8, description: "At least 8 chars, upper, lower, number, special" },
                phone: { type: "string", description: "Optional phone number" },
                address: { type: "string", description: "Optional address" },
                role: { type: "string", enum: ["customer", "retailer"], description: "User role (default: customer)" },
              },
            },
          },
        },
      },
      responses: {
        "201": { description: "User registered successfully" },
        "400": { description: "Validation error or email exists" },
      },
    },
  },
  "/api/auth/login": {
    post: {
      tags: ["Authentication"],
      summary: "Login with email and password",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email", "password"],
              properties: {
                email: { type: "string", format: "email" },
                password: { type: "string" },
              },
            },
          },
        },
      },
      responses: {
        "201": { description: "Login successful, returns user + JWT token" },
        "401": { description: "Invalid credentials" },
      },
    },
  },
  "/api/auth/forgot-password": {
    post: {
      tags: ["Authentication"],
      summary: "Request password reset email",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email"],
              properties: { email: { type: "string", format: "email" } },
            },
          },
        },
      },
      responses: {
        "200": { description: "Reset email sent if account exists" },
        "400": { description: "Invalid email" },
      },
    },
  },
  "/api/auth/reset-password": {
    post: {
      tags: ["Authentication"],
      summary: "Reset password using token from email",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["token", "newPassword"],
              properties: {
                token: { type: "string", description: "Reset token from email" },
                newPassword: { type: "string", minLength: 8 },
              },
            },
          },
        },
      },
      responses: {
        "200": { description: "Password reset successfully" },
        "400": { description: "Invalid or expired token" },
      },
    },
  },
  "/api/auth/change-password": {
    post: {
      tags: ["Authentication"],
      summary: "Change password (authenticated)",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["currentPassword", "newPassword"],
              properties: {
                currentPassword: { type: "string", description: "Current password" },
                newPassword: { type: "string", minLength: 8 },
              },
            },
          },
        },
      },
      responses: {
        "200": { description: "Password changed" },
        "400": { description: "Current password incorrect" },
      },
    },
  },
  "/api/auth/profile": {
    patch: {
      tags: ["Authentication"],
      summary: "Update profile (authenticated)",
      security: [{ bearerAuth: [] }],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: { name: { type: "string", maxLength: 100 } },
            },
          },
        },
      },
      responses: {
        "200": { description: "Profile updated" },
        "400": { description: "Validation error" },
      },
    },
  },
};

export default paths;
