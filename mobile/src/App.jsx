import { useState } from 'react';
import QrScanner from './QrScanner.jsx';
import './App.css';

function App() {
  const [qr, setQr] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState(null);

  const handleScan = async (data) => {
    setQr(data);
    setEnviado(false);
    setError(null);
    try {
      // Cambia la IP por la de tu PC si pruebas desde el móvil
      const res = await fetch('http://localhost:3001/api/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qr: data, fecha: new Date().toISOString() })
      });
      if (res.ok) {
        setEnviado(true);
      } else {
        setError('No se pudo enviar el registro');
      }
    } catch (err) {
      setError('Error de conexión con la API');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: 24, textAlign: 'center' }}>
      <h2>Escanear QR y enviar registro</h2>
      <QrScanner onScan={handleScan} />
      {qr && (
        <div style={{ marginTop: 18 }}>
          <b>QR detectado:</b>
          <div style={{ wordBreak: 'break-all', margin: 8 }}>{qr}</div>
        </div>
      )}
      {enviado && <div style={{ color: 'green', marginTop: 12 }}>¡Registro enviado correctamente!</div>}
      {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
    </div>
  );
}

export default App;
