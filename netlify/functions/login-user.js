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

    const userResult = await sql`
      SELECT * FROM users WHERE email = ${email};
    `;

    if (userResult.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'User not found.' }),
      };
    }

    const user = userResult[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Invalid password.' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Login successful.', isAdmin: user.is_admin }),
    };
  } catch (error) {
    console.error('Error logging in user:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'User login failed.' }),
    };
  }
};
