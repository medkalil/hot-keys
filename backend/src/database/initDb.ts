import fs from 'fs';
import path from 'path';
import pool from './client';

export async function initDb() {
  try {
    console.log('Loading init.sql...');
    const initSqlPath = path.join(__dirname, 'init.sql');
    if (fs.existsSync(initSqlPath)) {
      console.log('init.sql loaded successfully');
      const sql = fs.readFileSync(initSqlPath, 'utf-8');
      await pool.query(sql);
      console.log('✓ Database schema and level seeds verified successfully');
    }
  } catch (error) {
    console.error('Failed to initialize database schema:', error);
  }
}
