import {
  pgTable,
  serial,
  integer,
  text,
  boolean,
  timestamp,
  uuid,
  index,
  uniqueIndex,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    uuid: uuid("uuid").notNull().unique().default(sql`gen_random_uuid()`),
    name: text("name").notNull(),
    email: text("email").notNull(),
    password: text("password").notNull(),
    phone: text("phone"),
    address: text("address"),
    role: text("role").notNull().default("user"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => ({
    emailIdx: uniqueIndex("idx_users_email").on(t.email),
    roleIdx: index("idx_users_role").on(t.role),
  }),
);

export const categories = pgTable(
  "categories",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    parentId: integer("parent_id").references((): AnyPgColumn => categories.id, {
      onDelete: "set null",
    }),
    sortOrder: integer("sort_order").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => ({
    slugIdx: uniqueIndex("idx_categories_slug").on(t.slug),
    parentIdx: index("idx_categories_parent").on(t.parentId),
    activeIdx: index("idx_categories_active").on(t.isActive),
    sortIdx: index("idx_categories_sort").on(t.sortOrder),
  }),
);

export const products = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
    price: integer("price").notNull(),
    stock: integer("stock").notNull().default(0),
    category_id: integer("category_id").references(() => categories.id, {
      onDelete: "set null",
    }),
    image_url: text("image_url"),
    brand: text("brand"),
    status: text("status").notNull().default("active"),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => ({
    categoryIdx: index("idx_products_category").on(t.category_id),
    statusIdx: index("idx_products_status").on(t.status),
    statusCreatedIdx: index("idx_products_status_created").on(
      t.status,
      t.created_at,
    ),
    nameSearchIdx: index("idx_products_name").on(t.name),
  }),
);

export const cart = pgTable(
  "cart",
  {
    id: serial("id").primaryKey(),
    user_id: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    product_id: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    quantity: integer("quantity").notNull().default(1),
    created_at: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({
    cartUserIdx: index("idx_cart_user").on(t.user_id),
    cartProductIdx: index("idx_cart_product").on(t.product_id),
    cartUserProductUniq: uniqueIndex("idx_cart_user_product").on(
      t.user_id,
      t.product_id,
    ),
  }),
);

export const orders = pgTable(
  "orders",
  {
    id: serial("id").primaryKey(),
    order_code: text("order_code").notNull(),
    user_id: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    total_amount: integer("total_amount").notNull(),
    delivery_fee: integer("delivery_fee").notNull().default(0),
    payment_status: text("payment_status").notNull().default("pending"),
    delivery_status: text("delivery_status").notNull().default("processing"),
    transaction_ref: text("transaction_ref"),
    shipping_address: text("shipping_address"),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => ({
    orderCodeIdx: uniqueIndex("idx_orders_order_code").on(t.order_code),
    userIdx: index("idx_orders_user").on(t.user_id),
    paymentStatusIdx: index("idx_orders_payment_status").on(t.payment_status),
    deliveryStatusIdx: index("idx_orders_delivery_status").on(
      t.delivery_status,
    ),
    statusCreatedIdx: index("idx_orders_status_created").on(
      t.payment_status,
      t.created_at,
    ),
    userCreatedIdx: index("idx_orders_user_created").on(
      t.user_id,
      t.created_at,
    ),
  }),
);

export const orderItems = pgTable(
  "order_items",
  {
    id: serial("id").primaryKey(),
    order_id: integer("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    product_id: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    quantity: integer("quantity").notNull(),
    price: integer("price").notNull(),
  },
  (t) => ({
    orderIdx: index("idx_order_items_order").on(t.order_id),
    productIdx: index("idx_order_items_product").on(t.product_id),
    orderProductUniq: uniqueIndex("idx_order_items_order_product").on(
      t.order_id,
      t.product_id,
    ),
  }),
);

export const payments = pgTable(
  "payments",
  {
    id: serial("id").primaryKey(),
    user_id: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    order_id: integer("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    amount: integer("amount").notNull(),
    payment_method: text("payment_method"),
    payment_status: text("payment_status").notNull().default("pending"),
    transaction_ref: text("transaction_ref"),
    created_at: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({
    userIdx: index("idx_payments_user").on(t.user_id),
    orderIdx: index("idx_payments_order").on(t.order_id),
    statusIdx: index("idx_payments_status").on(t.payment_status),
    orderStatusIdx: index("idx_payments_order_status").on(
      t.order_id,
      t.payment_status,
    ),
  }),
);

export const notifications = pgTable(
  "notifications",
  {
    id: serial("id").primaryKey(),
    user_id: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    message: text("message").notNull(),
    is_read: boolean("is_read").notNull().default(false),
    created_at: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({
    userIdx: index("idx_notifications_user").on(t.user_id),
    userReadIdx: index("idx_notifications_user_read").on(
      t.user_id,
      t.is_read,
    ),
  }),
);

export const adminLogs = pgTable(
  "admin_logs",
  {
    id: serial("id").primaryKey(),
    admin_id: integer("admin_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    action: text("action").notNull(),
    created_at: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({
    adminIdx: index("idx_admin_logs_admin").on(t.admin_id),
    adminCreatedIdx: index("idx_admin_logs_admin_created").on(
      t.admin_id,
      t.created_at,
    ),
  }),
);

export const inventoryHistory = pgTable(
  "inventory_history",
  {
    id: serial("id").primaryKey(),
    product_id: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    previous_stock: integer("previous_stock").notNull(),
    new_stock: integer("new_stock").notNull(),
    updated_by: integer("updated_by")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    created_at: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({
    productIdx: index("idx_inventory_product").on(t.product_id),
    productCreatedIdx: index("idx_inventory_product_created").on(
      t.product_id,
      t.created_at,
    ),
  }),
);

export const locations = pgTable(
  "locations",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    code: text("code").notNull(),
    isActive: boolean("is_active").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => ({
    codeIdx: uniqueIndex("idx_locations_code").on(t.code),
    sortIdx: index("idx_locations_sort").on(t.sortOrder),
  }),
);

export const shippingZones = pgTable(
  "shipping_zones",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    states: text("states").notNull(),
    deliveryEstimate: text("delivery_estimate").notNull(),
    rate: integer("rate").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => ({
    sortIdx: index("idx_shipping_zones_sort").on(t.sortOrder),
  }),
);

export const reviews = pgTable(
  "reviews",
  {
    id: serial("id").primaryKey(),
    product_id: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    user_id: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    rating: integer("rating").notNull(),
    comment: text("comment"),
    status: text("status").notNull().default("pending"),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => ({
    productIdx: index("idx_reviews_product").on(t.product_id),
    statusIdx: index("idx_reviews_status").on(t.status),
    userProductIdx: uniqueIndex("idx_reviews_user_product").on(t.user_id, t.product_id),
  }),
);

export const cartReminders = pgTable(
  "cart_reminders",
  {
    id: serial("id").primaryKey(),
    user_id: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    remindedCount: integer("reminded_count").notNull().default(0),
    lastRemindedAt: timestamp("last_reminded_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => ({
    userIdx: uniqueIndex("idx_cart_reminders_user").on(t.user_id),
  }),
);

export const media = pgTable(
  "media",
  {
    id: serial("id").primaryKey(),
    filename: text("filename").notNull(),
    url: text("url").notNull(),
    altText: text("alt_text"),
    tags: text("tags"),
    mimeType: text("mime_type").notNull(),
    size: integer("size").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => ({
    createdIdx: index("idx_media_created").on(t.createdAt),
  }),
);

// ───────────────────── RELATIONS ─────────────────────

export const usersRelations = relations(users, ({ many }) => ({
  cart: many(cart),
  orders: many(orders),
  payments: many(payments),
  notifications: many(notifications),
  adminLogs: many(adminLogs),
  inventoryUpdates: many(inventoryHistory),
}));

export const categoriesRelations = relations(
  categories,
  ({ one, many }) => ({
    parent: one(categories, {
      fields: [categories.parentId],
      references: [categories.id],
      relationName: "categoryHierarchy",
    }),
    children: many(categories, {
      relationName: "categoryHierarchy",
    }),
    products: many(products),
  }),
);

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.category_id],
    references: [categories.id],
  }),
  cartItems: many(cart),
  orderItems: many(orderItems),
  inventoryHistory: many(inventoryHistory),
}));

export const cartRelations = relations(cart, ({ one }) => ({
  user: one(users, {
    fields: [cart.user_id],
    references: [users.id],
  }),
  product: one(products, {
    fields: [cart.product_id],
    references: [products.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.user_id],
    references: [users.id],
  }),
  items: many(orderItems),
  payments: many(payments),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.order_id],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.product_id],
    references: [products.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  user: one(users, {
    fields: [payments.user_id],
    references: [users.id],
  }),
  order: one(orders, {
    fields: [payments.order_id],
    references: [orders.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.user_id],
    references: [users.id],
  }),
}));

export const adminLogsRelations = relations(adminLogs, ({ one }) => ({
  admin: one(users, {
    fields: [adminLogs.admin_id],
    references: [users.id],
  }),
}));

export const inventoryHistoryRelations = relations(
  inventoryHistory,
  ({ one }) => ({
    product: one(products, {
      fields: [inventoryHistory.product_id],
      references: [products.id],
    }),
    updatedBy: one(users, {
      fields: [inventoryHistory.updated_by],
      references: [users.id],
    }),
  }),
);
