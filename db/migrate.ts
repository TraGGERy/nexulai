import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import { neon } from '@neondatabase/serverless';

// No need to configure httpAgent in this version
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Self-invoking async function to run migrations
(async () => {
  // Get the database connection string from environment variables
  const connectionString = process.env.DB;

  if (!connectionString) {
    console.error('Database connection string not found in environment variables');
    process.exit(1);
  }

  try {
    // Create the SQL client with the connection string
    const sql = neon(connectionString);
    
    // Create the database client
    const db = drizzle(sql);

    // Run migrations
    console.log('Running migrations...');
    await migrate(db, { migrationsFolder: './db/migrations' });
    console.log('Migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
})();