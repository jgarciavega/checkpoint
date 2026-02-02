// src/db.js
// Encapsula la creación del pool de MySQL y provee un helper de consulta.
// Usa variables de entorno: DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME, DB_CONN_LIMIT
require('dotenv').config();
const mysql = require('mysql2/promise');

let pool = null;

function createPoolIfConfigured() {
  if (process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: process.env.DB_CONN_LIMIT ? Number(process.env.DB_CONN_LIMIT) : 10,
      queueLimit: 0,
    });
    console.log('MySQL pool configurado desde src/db.js:', process.env.DB_HOST, process.env.DB_NAME);
  } else {
    console.log('No se encontraron credenciales MySQL en .env; pool no creado (modo log-only).');
  }
}

createPoolIfConfigured();

async function query(sql, params) {
  if (!pool) throw new Error('DB pool no configurado');
  return pool.query(sql, params);
}

module.exports = { pool, query, createPoolIfConfigured };
