import { neon } from '@netlify/neon';

const sql = neon();

export const handler = async () => {
  try {
    await sql`
      UPDATE visitors
      SET count = count + 1;
    `;

    const result = await sql`SELECT count FROM visitors`;
    const visitorCount = result[0].count;

    return {
      statusCode: 200,
      body: JSON.stringify({ count: visitorCount }),
    };
  } catch (error) {
    console.error('Error tracking visitor:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to track visitor.' }),
    };
  }
};
