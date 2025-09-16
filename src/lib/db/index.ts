import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

// Create a new Neon connection pool
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Create a Drizzle instance
export const db = drizzle(pool);