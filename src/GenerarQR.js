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

  // Deshabilitar módulo en dispositivos móviles
  if (window.innerWidth <= 768) {
    return <div>Esta funcionalidad no está disponible en dispositivos móviles.</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <h2>Generar Código QR</h2>
      <form style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '10px', backgroundColor: '#fff', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#333' }}>Información de la Unidad</h2>
          <button
            type="button"
            onClick={() => setFormData({
              tipo: '',
              unidad_id: '',
              conductor: '',
              empresa: '',
              modelo: '',
              numeroSerie: '',
              placas: '',
              anio: '',
              poliza: '',
              cantidadPasajeros: '',
            })}
            style={{ padding: '10px', borderRadius: '80%', backgroundColor: '#cfd72cff', color: '#5721d6ff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <img src="./assets/refrech2.png" alt="Refresh" style={{ width: '24px', height: '24px' }} />
          </button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', maxWidth: '800px', margin: 'auto', padding: '30px', border: '1px solid #ddd', borderRadius: '15px', backgroundColor: '#ffffff', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ flex: '1 1 calc(50% - 20px)', minWidth: '250px' }}>
            <label style={{ fontWeight: 'bold', color: '#333', marginBottom: '5px', display: 'block' }}>Tipo de Unidad:</label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc', width: '100%', fontSize: '16px', backgroundColor: '#f9f9f9' }}
            >
              <option value="">Seleccionar...</option>
              <option value="Automóvil">Automóvil</option>
              <option value="Camión">Camión</option>
              <option value="Trailer">Trailer</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
          <div style={{ flex: '1 1 calc(50% - 20px)', minWidth: '250px' }}>
            <label style={{ fontWeight: 'bold', color: '#333', marginBottom: '5px', display: 'block' }}>Número de Unidad:</label>
            <input
              type="text"
              name="unidad_id"
              placeholder="Ej: 1234, ABC-123"
              value={formData.unidad_id}
              onChange={handleChange}
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc', width: '100%', fontSize: '16px', backgroundColor: '#f9f9f9' }}
            />
          </div>
          <div style={{ flex: '1 1 calc(50% - 20px)', minWidth: '250px' }}>
            <label style={{ fontWeight: 'bold', color: '#333', marginBottom: '5px', display: 'block' }}>Conductor:</label>
            <input
              type="text"
              name="conductor"
              placeholder="Nombre completo del conductor"
              value={formData.conductor}
              onChange={handleChange}
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc', width: '100%', fontSize: '16px', backgroundColor: '#f9f9f9' }}
            />
          </div>
          <div style={{ flex: '1 1 calc(50% - 20px)', minWidth: '250px' }}>
            <label style={{ fontWeight: 'bold', color: '#333', marginBottom: '5px', display: 'block' }}>Empresa:</label>
            <input
              type="text"
              name="empresa"
              placeholder="Nombre de la empresa"
              value={formData.empresa}
              onChange={handleChange}
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc', width: '100%', fontSize: '16px', backgroundColor: '#f9f9f9' }}
            />
          </div>
          <div style={{ flex: '1 1 calc(50% - 20px)', minWidth: '250px' }}>
            <label style={{ fontWeight: 'bold', color: '#333', marginBottom: '5px', display: 'block' }}>Modelo del Vehículo:</label>
            <input
              type="text"
              name="modelo"
              placeholder="Ej: Versa 2022"
              value={formData.modelo}
              onChange={handleChange}
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc', width: '100%', fontSize: '16px', backgroundColor: '#f9f9f9' }}
            />
          </div>
          <div style={{ flex: '1 1 calc(50% - 20px)', minWidth: '250px' }}>
            <label style={{ fontWeight: 'bold', color: '#333', marginBottom: '5px', display: 'block' }}>Número de Serie:</label>
            <input
              type="text"
              name="numeroSerie"
              placeholder="Ej: 1HGCM82633A123456"
              value={formData.numeroSerie}
              onChange={handleChange}
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc', width: '100%', fontSize: '16px', backgroundColor: '#f9f9f9' }}
            />
          </div>
          <div style={{ flex: '1 1 calc(50% - 20px)', minWidth: '250px' }}>
            <label style={{ fontWeight: 'bold', color: '#333', marginBottom: '5px', display: 'block' }}>Placas:</label>
            <input
              type="text"
              name="placas"
              placeholder="Ej: ABC-123-CD"
              value={formData.placas}
              onChange={handleChange}
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc', width: '100%', fontSize: '16px', backgroundColor: '#f9f9f9' }}
            />
          </div>
          <div style={{ flex: '1 1 calc(50% - 20px)', minWidth: '250px' }}>
            <label style={{ fontWeight: 'bold', color: '#333', marginBottom: '5px', display: 'block' }}>Año del Vehículo:</label>
            <input
              type="text"
              name="anio"
              placeholder="Ej: 2022"
              value={formData.anio}
              onChange={handleChange}
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc', width: '100%', fontSize: '16px', backgroundColor: '#f9f9f9' }}
            />
          </div>
          <div style={{ flex: '1 1 calc(50% - 20px)', minWidth: '250px' }}>
            <label style={{ fontWeight: 'bold', color: '#333', marginBottom: '5px', display: 'block' }}>Póliza de Aseguranza:</label>
            <input
              type="text"
              name="poliza"
              placeholder="Número de póliza"
              value={formData.poliza}
              onChange={handleChange}
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc', width: '100%', fontSize: '16px', backgroundColor: '#f9f9f9' }}
            />
          </div>
          <div style={{ flex: '1 1 calc(50% - 20px)', minWidth: '250px' }}>
            <label style={{ fontWeight: 'bold', color: '#333', marginBottom: '5px', display: 'block' }}>Cantidad de Pasajeros:</label>
            <input
              type="number"
              name="cantidadPasajeros"
              placeholder="Ej: 45"
              value={formData.cantidadPasajeros}
              onChange={handleChange}
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc', width: '100%', fontSize: '16px', backgroundColor: '#f9f9f9' }}
            />
          </div>

          <button
            type="button"
            onClick={generarQR}
            style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#2563eb', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold', width: '100%', fontSize: '16px' }}
          >
            Generar QR
          </button>

          {qrCode && (
            <div style={{ textAlign: 'center', marginTop: '20px', width: '100%' }}>
              <img src={qrCode} alt="Código QR" style={{ width: '300px', height: '300px', margin: '0 auto' }} />
              <button
                type="button"
                onClick={imprimirQR}
                style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#10b981', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px', width: '100%', fontSize: '16px' }}
              >
                Imprimir QR
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

export default GenerarQR;
