import { neon } from '@neondatabase/serverless';

let client: ReturnType<typeof neon> | undefined;

function getClient() {
  if (!client) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    client = neon(process.env.DATABASE_URL);
  }
  return client;
}

// Lazily creates the Neon client on first query instead of at import time,
// so builds don't fail when DATABASE_URL isn't available (e.g. static analysis).
export const sql: ReturnType<typeof neon> = ((...args: Parameters<ReturnType<typeof neon>>) =>
  getClient()(...args)) as ReturnType<typeof neon>;
