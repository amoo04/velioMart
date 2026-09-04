DROP INDEX "idx_products_id";--> statement-breakpoint
ALTER TABLE "order_items" ALTER COLUMN "price" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "total_amount" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "amount" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "price" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
CREATE INDEX "idx_admin_logs_admin_created" ON "admin_logs" USING btree ("admin_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_cart_user_product" ON "cart" USING btree ("user_id","product_id");--> statement-breakpoint
CREATE INDEX "idx_categories_name" ON "categories" USING btree ("name");--> statement-breakpoint
CREATE INDEX "idx_inventory_product_created" ON "inventory_history" USING btree ("product_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_notifications_user_read" ON "notifications" USING btree ("user_id","is_read");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_order_items_order_product" ON "order_items" USING btree ("order_id","product_id");--> statement-breakpoint
CREATE INDEX "idx_orders_payment_status" ON "orders" USING btree ("payment_status");--> statement-breakpoint
CREATE INDEX "idx_orders_delivery_status" ON "orders" USING btree ("delivery_status");--> statement-breakpoint
CREATE INDEX "idx_orders_status_created" ON "orders" USING btree ("payment_status","created_at");--> statement-breakpoint
CREATE INDEX "idx_orders_user_created" ON "orders" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_payments_status" ON "payments" USING btree ("payment_status");--> statement-breakpoint
CREATE INDEX "idx_payments_order_status" ON "payments" USING btree ("order_id","payment_status");--> statement-breakpoint
CREATE INDEX "idx_products_status" ON "products" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_products_status_created" ON "products" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "idx_products_name" ON "products" USING btree ("name");--> statement-breakpoint
CREATE INDEX "idx_users_role" ON "users" USING btree ("role");