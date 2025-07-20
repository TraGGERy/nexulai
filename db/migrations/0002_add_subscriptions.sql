-- Create subscription_plan enum type
CREATE TYPE "public"."subscription_plan" AS ENUM('free', 'monthly', 'yearly');

-- Add new columns to users table
ALTER TABLE "public"."users" ADD COLUMN "clerk_id" text NOT NULL;
ALTER TABLE "public"."users" ADD COLUMN "daily_reports_count" integer NOT NULL DEFAULT 0;
ALTER TABLE "public"."users" ADD COLUMN "last_report_date" timestamp;

-- Add unique constraint to clerk_id
ALTER TABLE "public"."users" ADD CONSTRAINT "users_clerk_id_unique" UNIQUE("clerk_id");

-- Add user_id column to reports table
ALTER TABLE "public"."reports" ADD COLUMN "user_id" serial NOT NULL;

-- Create subscriptions table
CREATE TABLE "public"."subscriptions" (
  "id" serial PRIMARY KEY NOT NULL,
  "user_id" serial NOT NULL,
  "stripe_customer_id" text NOT NULL,
  "stripe_subscription_id" text NOT NULL,
  "stripe_price_id" text NOT NULL,
  "plan" text NOT NULL,
  "status" text NOT NULL,
  "current_period_start" timestamp NOT NULL,
  "current_period_end" timestamp NOT NULL,
  "cancel_at_period_end" boolean NOT NULL DEFAULT false,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

-- Add foreign key constraints
ALTER TABLE "public"."subscriptions" ADD CONSTRAINT "subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;
ALTER TABLE "public"."reports" ADD CONSTRAINT "reports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;