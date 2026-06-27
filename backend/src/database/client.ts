import { Pool, QueryResult } from 'pg';
import 'dotenv/config';

const isProduction = process.env.NODE_ENV === 'production';

const pool = new Pool({
  user: process.env.DB_USER || 'hotkeys_user',
  password: process.env.DB_PASSWORD || 'hotkeys_password',
  host: isProduction ? process.env.DB_HOST : 'localhost',
  port: isProduction ? parseInt(process.env.DB_PORT || '5432') : 5433,
  database: process.env.DB_NAME || 'hotkeys_db',
});

pool.on('error', (err) => {
  console.error('Unexpected pool error:', err);
});

export async function query(
  text: string,
  params?: (string | number | boolean | null | object)[]
): Promise<QueryResult> {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log(`[DB] Executed query in ${duration}ms:`, text.substring(0, 50));
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export async function closePool(): Promise<void> {
  await pool.end();
}

export default pool;
