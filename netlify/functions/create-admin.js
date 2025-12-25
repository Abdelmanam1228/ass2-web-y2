import { neon } from '@netlify/neon';
import bcrypt from 'bcryptjs';

const sql = neon();

// IMPORTANT: Set ADMIN_EMAIL and ADMIN_PASSWORD in Netlify environment variables
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export const handler = async () => {
  try {
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'ADMIN_EMAIL and ADMIN_PASSWORD environment variables must be set.' }),
      };
    }

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    // Check if admin already exists
    const existingAdmin = await sql`
      SELECT * FROM users WHERE email = ${ADMIN_EMAIL}
    `;

    if (existingAdmin.length > 0) {
      return {
        statusCode: 409,
        body: JSON.stringify({ message: 'Admin user already exists.' }),
      };
    }

    // Create admin user
    await sql`
      INSERT INTO users (email, password, is_admin)
      VALUES (${ADMIN_EMAIL}, ${hashedPassword}, TRUE);
    `;

    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'Admin user created successfully.' }),
    };
  } catch (error) {
    console.error('Error creating admin user:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to create admin user.' }),
    };
  }
};
