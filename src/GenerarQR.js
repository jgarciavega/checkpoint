import React, { useState } from 'react';
import QRCode from 'qrcode';

function GenerarQR() {
  const [formData, setFormData] = useState({
    tipo: '',
    unidad_id: '',
    conductor: '',
    empresa: '',
    modelo: '',
    numeroSerie: '',
    placas: '',
    anio: '',
    poliza: '',
    cantidadPasajeros: '', // Nuevo campo agregado
  });
  const [qrCode, setQrCode] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generarQR = () => {
    const data = JSON.stringify(formData);
    QRCode.toDataURL(data, { width: 200 }, (err, url) => {
      if (err) console.error(err);
      setQrCode(url);
      registrarQR(data);
    });
  };

  const registrarQR = (data) => {
    const registros = JSON.parse(localStorage.getItem('registrosQR')) || [];
    const nuevoRegistro = {
      ...formData,
      fechaHora: new Date().toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'medium' }),
    };
    registros.push(nuevoRegistro);
    localStorage.setItem('registrosQR', JSON.stringify(registros));
  };

  const imprimirQR = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <div style="display: flex; justify-content: center; align-items: center; height: 100vh;">
        <img src="${qrCode}" alt="Código QR" style="width: 300px; height: 300px;" />
      </div>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <h2>Generar Código QR</h2>
      <form style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '600px', margin: 'auto', padding: '20px', border: '1px solid #ccc', borderRadius: '10px', backgroundColor: '#f9f9f9' }}>
        <label style={{ fontWeight: 'bold' }}>Tipo de Unidad:</label>
        <select
          name="tipo"
          value={formData.tipo}
          onChange={handleChange}
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        >
          <option value="">Seleccionar...</option>
          <option value="Automóvil">Automóvil</option>
          <option value="Camión">Camión</option>
          <option value="Trailer">Trailer</option>
          <option value="Otro">Otro</option>
        </select>

        <label style={{ fontWeight: 'bold' }}>Número de Unidad:</label>
        <input
          type="text"
          name="unidad_id"
          placeholder="Ej: 1234, ABC-123"
          value={formData.unidad_id}
          onChange={handleChange}
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />

        <label style={{ fontWeight: 'bold' }}>Conductor:</label>
        <input
          type="text"
          name="conductor"
          placeholder="Nombre completo del conductor"
          value={formData.conductor}
          onChange={handleChange}
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />

        <label style={{ fontWeight: 'bold' }}>Empresa:</label>
        <input
          type="text"
          name="empresa"
          placeholder="Nombre de la empresa"
          value={formData.empresa}
          onChange={handleChange}
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />

        <label style={{ fontWeight: 'bold' }}>Modelo del Vehículo:</label>
        <input
          type="text"
          name="modelo"
          placeholder="Ej: Versa 2022"
          value={formData.modelo}
          onChange={handleChange}
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />

        <label style={{ fontWeight: 'bold' }}>Número de Serie:</label>
        <input
          type="text"
          name="numeroSerie"
          placeholder="Ej: 1HGCM82633A123456"
          value={formData.numeroSerie}
          onChange={handleChange}
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />

        <label style={{ fontWeight: 'bold' }}>Placas:</label>
        <input
          type="text"
          name="placas"
          placeholder="Ej: ABC-123-CD"
          value={formData.placas}
          onChange={handleChange}
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />

        <label style={{ fontWeight: 'bold' }}>Año del Vehículo:</label>
        <input
          type="text"
          name="anio"
          placeholder="Ej: 2022"
          value={formData.anio}
          onChange={handleChange}
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />

        <label style={{ fontWeight: 'bold' }}>Póliza de Aseguranza:</label>
        <input
          type="text"
          name="poliza"
          placeholder="Número de póliza"
          value={formData.poliza}
          onChange={handleChange}
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />

        <label style={{ fontWeight: 'bold' }}>Cantidad de Pasajeros:</label>
        <input
          type="number"
          name="cantidadPasajeros"
          placeholder="Ej: 45"
          value={formData.cantidadPasajeros}
          onChange={handleChange}
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />

        <button
          type="button"
          onClick={generarQR}
          style={{ padding: '10px', borderRadius: '5px', backgroundColor: '#2563eb', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Generar QR
        </button>

        {qrCode && (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <img src={qrCode} alt="Código QR" style={{ width: '300px', height: '300px', margin: '0 auto' }} />
            <button
              type="button"
              onClick={imprimirQR}
              style={{ padding: '10px', borderRadius: '5px', backgroundColor: '#10b981', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }}
            >
              Imprimir QR
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

export default GenerarQR;
