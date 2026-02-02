// scripts/test-db-conn.js
require('dotenv').config();
const mysql = require('mysql2/promise');

async function test() {
  try {
    const pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      connectionLimit: 2,
    });

    const [rows] = await pool.query('SELECT 1 + 1 AS solution');
    console.log('Conexión OK, resultado prueba:', rows);

    try {
      const [r2] = await pool.query('SELECT COUNT(*) AS total FROM registros');
      console.log('Registros en tabla registros:', r2[0].total);
    } catch (err) {
      console.log('No se pudo contar registros (tabla puede no existir):', err.message);
    }

    await pool.end();
  } catch (err) {
    console.error('Error en conexión DB:', err.message);
    process.exit(1);
  }
}

test();
