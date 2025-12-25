import { neon } from '@netlify/neon';
import bcrypt from 'bcryptjs';

const sql = neon();

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { email, password } = JSON.parse(event.body);

    if (!email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Email and password are required.' }),
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await sql`
      INSERT INTO users (email, password)
      VALUES (${email}, ${hashedPassword});
    `;

    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'User registered successfully.' }),
    };
  } catch (error) {
    // Handle unique constraint violation for email
    if (error.message.includes('duplicate key value violates unique constraint')) {
      return {
        statusCode: 409,
        body: JSON.stringify({ error: 'Email already in use.' }),
      };
    }
    console.error('Error registering user:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'User registration failed.' }),
    };
  }
};
