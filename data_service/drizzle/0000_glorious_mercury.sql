CREATE TYPE "public"."countingUnit" AS ENUM('Number', 'Pair', 'Set');--> statement-breakpoint
CREATE TYPE "public"."discountType" AS ENUM('percentage', 'fixed_amount');--> statement-breakpoint
CREATE TYPE "public"."orderStatus" AS ENUM('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled');--> statement-breakpoint
CREATE TYPE "public"."partType" AS ENUM('Original', 'Stock', 'After_Market');--> statement-breakpoint
CREATE TYPE "public"."paymentMethod" AS ENUM('Cod', 'Card_Transfer');--> statement-breakpoint
CREATE TYPE "public"."paymentStatus" AS ENUM('Unpaid', 'Paid', 'Refunded');--> statement-breakpoint
CREATE TYPE "public"."reviewStatus" AS ENUM('Pending', 'Approved', 'Rejected');--> statement-breakpoint
CREATE TYPE "public"."userRole" AS ENUM('Super_Admin', 'Super', 'User');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('Active', 'Inactive');--> statement-breakpoint
CREATE TYPE "public"."supplierType" AS ENUM('Manufacturer', 'Importer', 'Distributor', 'Official_Representative');--> statement-breakpoint
CREATE TABLE "addresses" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"receiver_name" varchar(50) NOT NULL,
	"receiver_phone" varchar(11) NOT NULL,
	"province" varchar(50) NOT NULL,
	"city" varchar(50) NOT NULL,
	"postal_code" varchar(10) NOT NULL,
	"line" text NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "banners" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(150) NOT NULL,
	"subtitle" varchar(250),
	"image_url" varchar(500) NOT NULL,
	"link_url" varchar(500) NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "car_brands" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"slug" varchar(50) NOT NULL,
	"country" varchar(50) NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "car_brands_name_unique" UNIQUE("name"),
	CONSTRAINT "car_brands_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "cars" (
	"id" serial PRIMARY KEY NOT NULL,
	"name_fa" varchar(50) NOT NULL,
	"name_en" varchar(50) NOT NULL,
	"brand_Id" integer NOT NULL,
	"year_of_manufacture" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(120) NOT NULL,
	"parent_id" integer,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "categories_name_unique" UNIQUE("name"),
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "contact_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(120) NOT NULL,
	"email" varchar(150) NOT NULL,
	"phone" varchar(11),
	"subject" varchar(200) NOT NULL,
	"message" text NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "discounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"amount" integer NOT NULL,
	"discountType" "discountType" DEFAULT 'percentage' NOT NULL,
	"status" "status" DEFAULT 'Active' NOT NULL,
	"start_date" timestamp DEFAULT now() NOT NULL,
	"end_date" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"part_id" integer NOT NULL,
	"part_name" varchar(180) NOT NULL,
	"part_number" varchar(100),
	"image_url" varchar(500),
	"quantity" integer DEFAULT 1 NOT NULL,
	"unit_price" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"status" "orderStatus" DEFAULT 'Pending' NOT NULL,
	"payment_method" "paymentMethod" NOT NULL,
	"payment_status" "paymentStatus" DEFAULT 'Unpaid' NOT NULL,
	"receiver_name" varchar(120) NOT NULL,
	"receiver_phone" varchar(11) NOT NULL,
	"province" varchar(50) NOT NULL,
	"city" varchar(50) NOT NULL,
	"postal_code" varchar(10) NOT NULL,
	"address_line" text NOT NULL,
	"note" text,
	"items_subtotal" integer DEFAULT 0 NOT NULL,
	"discount_amount" integer DEFAULT 0 NOT NULL,
	"shipping_cost" integer DEFAULT 0 NOT NULL,
	"total_amount" integer DEFAULT 0 NOT NULL,
	"tracking_code" varchar(50),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "part_brands" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"slug" varchar(50) NOT NULL,
	"country_of_origin" varchar(50) NOT NULL,
	"description" text,
	"status" "status" DEFAULT 'Active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "part_compatibility" (
	"id" serial PRIMARY KEY NOT NULL,
	"part_id" integer NOT NULL,
	"car_model_id" integer NOT NULL,
	"years_note" varchar(40) DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "parts" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(180) NOT NULL,
	"slug" varchar(220) NOT NULL,
	"brand_id" integer,
	"description" text,
	"price" integer NOT NULL,
	"discount_amount" integer,
	"stock" integer DEFAULT 0 NOT NULL,
	"part_number" varchar(100),
	"weight_grams" integer,
	"supplier" integer NOT NULL,
	"unit" "countingUnit" DEFAULT 'Number' NOT NULL,
	"category_id" integer,
	"status" "status" DEFAULT 'Active' NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"meta_title" varchar(200),
	"meta_description" varchar(400),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"part_id" integer NOT NULL,
	"url" varchar(500) NOT NULL,
	"alt" varchar(200),
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "return_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"reason_description" text,
	"status" "status" DEFAULT 'Active' NOT NULL,
	"requested_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"part_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"rating" integer NOT NULL,
	"comment" text NOT NULL,
	"status" "reviewStatus" DEFAULT 'Pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shopping_cart" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"part_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "suppliers" (
	"id" serial PRIMARY KEY NOT NULL,
	"supplier_name" varchar(40) NOT NULL,
	"supplier_type" "supplierType" DEFAULT 'Distributor' NOT NULL,
	"contact_person_name" varchar(50) NOT NULL,
	"national_code" varchar(11) NOT NULL,
	"phone_number" varchar(11) NOT NULL,
	"bank_account_number" varchar(24) NOT NULL,
	"score" integer NOT NULL,
	"status" "status" DEFAULT 'Active' NOT NULL,
	"cooperation_start_date" timestamp DEFAULT now() NOT NULL,
	"description" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" varchar(50) NOT NULL,
	"last_name" varchar(50) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(11) NOT NULL,
	"national_code" varchar(10) NOT NULL,
	"status" "status" DEFAULT 'Active' NOT NULL,
	"password" varchar(255) NOT NULL,
	"role" "userRole" DEFAULT 'User' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
CREATE TABLE "wishlist" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"part_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cars" ADD CONSTRAINT "cars_brand_Id_car_brands_id_fk" FOREIGN KEY ("brand_Id") REFERENCES "public"."car_brands"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_part_id_parts_id_fk" FOREIGN KEY ("part_id") REFERENCES "public"."parts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "part_compatibility" ADD CONSTRAINT "part_compatibility_part_id_parts_id_fk" FOREIGN KEY ("part_id") REFERENCES "public"."parts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "part_compatibility" ADD CONSTRAINT "part_compatibility_car_model_id_cars_id_fk" FOREIGN KEY ("car_model_id") REFERENCES "public"."cars"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parts" ADD CONSTRAINT "parts_brand_id_part_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."part_brands"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parts" ADD CONSTRAINT "parts_discount_amount_discounts_id_fk" FOREIGN KEY ("discount_amount") REFERENCES "public"."discounts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parts" ADD CONSTRAINT "parts_supplier_suppliers_id_fk" FOREIGN KEY ("supplier") REFERENCES "public"."suppliers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parts" ADD CONSTRAINT "parts_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_part_id_parts_id_fk" FOREIGN KEY ("part_id") REFERENCES "public"."parts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "return_requests" ADD CONSTRAINT "return_requests_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "return_requests" ADD CONSTRAINT "return_requests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_part_id_parts_id_fk" FOREIGN KEY ("part_id") REFERENCES "public"."parts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shopping_cart" ADD CONSTRAINT "shopping_cart_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shopping_cart" ADD CONSTRAINT "shopping_cart_part_id_parts_id_fk" FOREIGN KEY ("part_id") REFERENCES "public"."parts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wishlist" ADD CONSTRAINT "wishlist_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wishlist" ADD CONSTRAINT "wishlist_part_id_parts_id_fk" FOREIGN KEY ("part_id") REFERENCES "public"."parts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "addresses_user_idx" ON "addresses" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "banners_placement_idx" ON "banners" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "categories_parent_idx" ON "categories" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "contact_messages_read_idx" ON "contact_messages" USING btree ("is_read","created_at");--> statement-breakpoint
CREATE INDEX "order_items_order_idx" ON "order_items" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "orders_user_idx" ON "orders" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "orders_status_created_idx" ON "orders" USING btree ("status","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "part_compat_unique" ON "part_compatibility" USING btree ("part_id","car_model_id","years_note");--> statement-breakpoint
CREATE INDEX "part_compat_model_idx" ON "part_compatibility" USING btree ("car_model_id");--> statement-breakpoint
CREATE UNIQUE INDEX "parts_slug_unique" ON "parts" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "parts_category_idx" ON "parts" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "parts_brand_idx" ON "parts" USING btree ("brand_id");--> statement-breakpoint
CREATE INDEX "parts_active_featured_idx" ON "parts" USING btree ("status","is_featured");--> statement-breakpoint
CREATE INDEX "parts_part_number_idx" ON "parts" USING btree ("part_number");--> statement-breakpoint
CREATE INDEX "product_images_part_idx" ON "product_images" USING btree ("part_id");--> statement-breakpoint
CREATE UNIQUE INDEX "reviews_part_user_unique" ON "reviews" USING btree ("part_id","user_id");--> statement-breakpoint
CREATE INDEX "reviews_part_status_idx" ON "reviews" USING btree ("part_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "shopping_cart_user_part_unique" ON "shopping_cart" USING btree ("user_id","part_id");--> statement-breakpoint
CREATE UNIQUE INDEX "wishlist_user_part_unique" ON "wishlist" USING btree ("user_id","part_id");