import authPaths from "../modules/auth/auth.docs";
import productsPaths from "../modules/products/products.docs";
import categoriesPaths from "../modules/categories/categories.docs";
import cartsPaths from "../modules/carts/carts.docs";
import ordersPaths from "../modules/orders/orders.docs";
import paymentsPaths from "../modules/payments/payments.docs";
import usersPaths from "../modules/users/users.docs";
import adminPaths from "../modules/admin/admin.docs";
import inventoryPaths from "../modules/inventory/inventory.docs";
import notificationPaths from "../modules/notification/notification.docs";
import emailPaths from "../modules/email/email.docs";
import imagesPaths from "../modules/images/images.docs";
import searchPaths from "../modules/search/search.docs";

export const openApiSpec = {
  openapi: "3.1.0",
  info: {
    title: "E-Commerce API",
    version: "1.0.0",
    description:
      "RESTful API for an e-commerce platform. Supports user auth, product catalog, shopping cart, orders, payments, inventory, notifications, search, and admin management.",
  },
  servers: [
    { url: "http://localhost:3000", description: "Development server" },
  ],
  paths: {
    ...authPaths,
    ...productsPaths,
    ...categoriesPaths,
    ...cartsPaths,
    ...ordersPaths,
    ...paymentsPaths,
    ...usersPaths,
    ...adminPaths,
    ...inventoryPaths,
    ...notificationPaths,
    ...emailPaths,
    ...imagesPaths,
    ...searchPaths,
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "JWT token obtained from /api/auth/login",
      },
    },
  },
};
