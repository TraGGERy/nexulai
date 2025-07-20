import type { Config } from 'drizzle-kit';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get the database connection string from environment variables
const connectionString = process.env.DB;

if (!connectionString) {
  throw new Error('Database connection string not found in environment variables');
}

export default {
  schema: './db/schema.ts',
  out: './db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_l7m9pgsEOrHq@ep-blue-base-af6dg6ll-pooler.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
  },
} satisfies Config;