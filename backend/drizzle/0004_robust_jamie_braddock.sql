CREATE TABLE "locations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"code" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shipping_zones" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"states" text NOT NULL,
	"delivery_estimate" text NOT NULL,
	"rate" integer NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "order_code" text;--> statement-breakpoint
CREATE UNIQUE INDEX "idx_locations_code" ON "locations" USING btree ("code");--> statement-breakpoint
CREATE INDEX "idx_locations_sort" ON "locations" USING btree ("sort_order");--> statement-breakpoint
CREATE INDEX "idx_shipping_zones_sort" ON "shipping_zones" USING btree ("sort_order");