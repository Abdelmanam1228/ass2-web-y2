import { neon } from '@netlify/neon';
import bcrypt from 'bcryptjs';

const sql = neon();

export const handler = async () => {
  try {
    // Create Users Table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        is_admin BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Create Visitors Table
    await sql`
      CREATE TABLE IF NOT EXISTS visitors (
        id SERIAL PRIMARY KEY,
        count BIGINT NOT NULL DEFAULT 0
      );
    `;

    // Insert a default counter if it doesn't exist
    const result = await sql`SELECT count(*) FROM visitors`;
    if (result[0].count === '0') {
      await sql`INSERT INTO visitors (count) VALUES (0)`;
    }

    console.log('Database tables created successfully.');

    // Optionally create an admin user if environment variables are provided
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    if (ADMIN_EMAIL && ADMIN_PASSWORD) {
      // Check if admin already exists
      const existing = await sql`SELECT * FROM users WHERE email = ${ADMIN_EMAIL}`;
      if (existing.length === 0) {
        const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);
        await sql`
          INSERT INTO users (email, password, is_admin)
          VALUES (${ADMIN_EMAIL}, ${hashed}, TRUE)
        `;
        console.log('Admin user seeded from environment variables.');
      } else {
        console.log('Admin user already exists; skipping seed.');
      }
    } else {
      console.log('Admin env vars not set; skipping admin seed.');
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Database setup complete.' }),
    };
  } catch (error) {
    console.error('Error setting up database:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Database setup failed.' }),
    };
  }
};
