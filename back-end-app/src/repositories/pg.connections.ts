import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

let pool: Pool | null = null;

export async function initDb() {

  try {

    pool = new Pool({
      port: parseInt(process.env.DB_PORT || '5432', 10),
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'postgres',
    });

    await pool.connect();

    await pool.query(`
CREATE TABLE IF NOT EXISTS users(
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE IF NOT EXISTS wallet(
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  balance DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  createa_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

`)

    console.log('Database connection initialized');

  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw new Error('Failed to connect to the database');
  }
}

export function getDbPool(): Pool {
  if (!pool) {
    throw new Error('Database connection has not been initialized. Call initDb() first.');
  }
  return pool;
}





