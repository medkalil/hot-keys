import fs from 'fs';
import path from 'path';
import pool from './client';

export async function initDb() {
  try {
    const initSqlPath = path.join(__dirname, 'init.sql');
    if (fs.existsSync(initSqlPath)) {
      const sql = fs.readFileSync(initSqlPath, 'utf-8');
      await pool.query(sql);
      console.log('✓ Database schema and level seeds verified successfully');
    }
  } catch (error) {
    console.error('Failed to initialize database schema:', error);
  }
}
