const { Pool } = require('pg');
const dbConfig = require('../config/db.config'); // Adjust based on the actual path

const pool = new Pool(dbConfig);

pool.on('connect', () => {
  console.log('Connected to the database');
});

pool.on('error', (err) => {
  console.error('Error connecting to the database:', err);
});

const query = async (text, params) => {
  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    return res;
  } finally {
    client.release();
  }
};

module.exports = pool;