import { pgTable, serial, text, timestamp, json, pgEnum, integer, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Define report types enum
export const reportTypeEnum = pgEnum('report_type', ['strategy', 'market', 'financial', 'operations']);

// Define subscription plan types enum
export const subscriptionPlanEnum = pgEnum('subscription_plan', ['free', 'monthly', 'yearly']);

// Reports table to store analysis results
export const reports = pgTable('reports', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  type: reportTypeEnum('type').notNull(), // Use the enum for type validation
  content: json('content').notNull(),
  userId: serial('user_id').notNull(), // Add user ID to track who created the report
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Users table (for authentication)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  clerkId: text('clerk_id').notNull().unique(), // Store Clerk user ID for authentication
  dailyReportsCount: integer('daily_reports_count').default(0).notNull(), // Track daily report usage
  lastReportDate: timestamp('last_report_date'), // Track when the last report was created
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Subscriptions table to store user subscription information
export const subscriptions = pgTable('subscriptions', {
  id: serial('id').primaryKey(),
  userId: serial('user_id').references(() => users.id).notNull(),
  stripeCustomerId: text('stripe_customer_id').notNull(), // Stripe customer ID
  stripeSubscriptionId: text('stripe_subscription_id').notNull(), // Stripe subscription ID
  stripePriceId: text('stripe_price_id').notNull(), // Stripe price ID
  plan: text('plan').notNull(), // 'monthly' or 'yearly'
  status: text('status').notNull(), // 'active', 'canceled', 'past_due', etc.
  currentPeriodStart: timestamp('current_period_start').notNull(),
  currentPeriodEnd: timestamp('current_period_end').notNull(),
  cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// User reports relationship table
export const userReports = pgTable('user_reports', {
  id: serial('id').primaryKey(),
  userId: serial('user_id').references(() => users.id),
  reportId: serial('report_id').references(() => reports.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Define relations between tables
export const reportsRelations = relations(reports, ({ one, many }) => ({
  userReports: many(userReports),
  user: one(users, {
    fields: [reports.userId],
    references: [users.id],
  }),
}));

export const usersRelations = relations(users, ({ many, one }) => ({
  userReports: many(userReports),
  reports: many(reports),
  subscription: one(subscriptions, {
    fields: [users.id],
    references: [subscriptions.userId],
  }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
}));

export const userReportsRelations = relations(userReports, ({ one }) => ({
  user: one(users, {
    fields: [userReports.userId],
    references: [users.id],
  }),
  report: one(reports, {
    fields: [userReports.reportId],
    references: [reports.id],
  }),
}));