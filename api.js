// api.js
// Servidor Express para recibir registros desde móvil/tablet

require('dotenv').config();
const express = require('express');
const app = express();
const db = require('./src/db');

const PORT = process.env.API_PORT ? Number(process.env.API_PORT) : 3000; // puedes configurar en .env

app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API de checkpoint activa');
});

// Ruta para recibir registros de QR
app.post('/api/registro', async (req, res) => {
  const registro = req.body || {};
  console.log('Registro recibido:', registro);

  // Si no hay pool configurado, devolvemos OK y no intentamos insertar
  if (!db.pool) {
    return res.json({ ok: true, mensaje: 'Registro recibido (modo log, sin BD)', registro });
  }

  try {
    // Intentamos insertar en tabla 'registros'. Ajusta columnas según tu esquema real.
    const sql = `INSERT INTO registros (numeroUnidad, conductor, empresa, movimiento, fecha, payload)
                 VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [
      registro.numeroUnidad || null,
      registro.conductor || null,
      registro.empresa || null,
      registro.movimiento || null,
      registro.fecha ? new Date(registro.fecha) : new Date(),
      JSON.stringify(registro),
    ];

    const [result] = await db.query(sql, values);
    console.log('Guardado en BD, id=', result.insertId);
    return res.json({ ok: true, insertId: result.insertId });
  } catch (err) {
    console.error('Error guardando en BD:', err);
    // devolver OK para no romper al cliente móvil, pero informar del error
    return res.status(500).json({ ok: false, error: err.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`API escuchando en http://0.0.0.0:${PORT}`);
});
