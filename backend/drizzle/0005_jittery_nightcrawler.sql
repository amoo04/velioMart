ALTER TABLE "orders" ALTER COLUMN "order_code" SET NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "idx_orders_order_code" ON "orders" USING btree ("order_code");