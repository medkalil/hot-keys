import 'dotenv/config';
import app from './app';
import { query } from './database/client';
import { initDb } from './database/initDb';

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Test database connection
    console.log('Testing database connection...');
    const result = await query('SELECT NOW()');
    console.log('✓ Database connected:', result.rows[0]);

    // Initialize database schema and seeds
    await initDb();

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 API docs available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
});
