import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

// No need to configure neon in this version
import * as schema from './schema';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get the database connection string from environment variables
const connectionString = process.env.DB;

if (!connectionString) {
  throw new Error('Database connection string not found in environment variables');
}

// Create the SQL client with the connection string
const sql = neon(connectionString);

// Create the database client with the schema
export const db = drizzle(sql, { schema });