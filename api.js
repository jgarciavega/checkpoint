// api.js
// Servidor Express para recibir registros desde móvil/tablet

const express = require('express');
const app = express();
const PORT = 3001; // Puedes cambiar el puerto si lo necesitas

app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API de checkpoint activa');
});

// Ruta para recibir registros de QR
app.post('/api/registro', (req, res) => {
  const registro = req.body;
  // Aquí puedes guardar el registro en la base de datos (SQLite)
  console.log('Registro recibido:', registro);
  res.json({ ok: true, mensaje: 'Registro recibido', registro });
});

app.listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT}`);
});
