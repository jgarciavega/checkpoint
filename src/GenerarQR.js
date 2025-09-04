import React, { useState } from 'react';
import QRCode from 'qrcode';
import './styles/GenerarQR.css';

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
    cantidadPasajeros: '',
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

  const handleReset = () => {
    setFormData({
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
    });
    setQrCode('');
  };

  // Deshabilitar módulo en dispositivos móviles
  if (window.innerWidth <= 768) {
    return <div>Esta funcionalidad no está disponible en dispositivos móviles.</div>;
  }

  return (
    <div className="qr-generator">
      <div className="qr-form">
        <div className="form-header">
          <h2 className="form-title">Información de la Unidad</h2>
          <button
            type="button"
            onClick={handleReset}
            className="btn-refresh"
          >
            <img src="./assets/refrech2.png" alt="Refresh" width="24" height="24" />
          </button>
        </div>

        <div className="form-body">
          <div className="form-group">
            <label className="form-label">Tipo de Unidad:</label>
            <select
              className="form-select"
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
            >
              <option value="">Seleccionar...</option>
              <option value="Automóvil">Automóvil</option>
              <option value="Camión">Camión</option>
              <option value="Trailer">Trailer</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Número de Unidad:</label>
            <input
              type="text"
              className="form-input"
              name="unidad_id"
              placeholder="Ej: 1234, ABC-123"
              value={formData.unidad_id}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Conductor:</label>
            <input
              type="text"
              className="form-input"
              name="conductor"
              placeholder="Nombre completo del conductor"
              value={formData.conductor}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Empresa:</label>
            <input
              type="text"
              className="form-input"
              name="empresa"
              placeholder="Nombre de la empresa"
              value={formData.empresa}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Modelo del Vehículo:</label>
            <input
              type="text"
              className="form-input"
              name="modelo"
              placeholder="Ej: Versa 2022"
              value={formData.modelo}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Número de Serie:</label>
            <input
              type="text"
              className="form-input"
              name="numeroSerie"
              placeholder="Ej: 1HGCM82633A123456"
              value={formData.numeroSerie}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Placas:</label>
            <input
              type="text"
              className="form-input"
              name="placas"
              placeholder="Ej: ABC-123-CD"
              value={formData.placas}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Año del Vehículo:</label>
            <input
              type="text"
              className="form-input"
              name="anio"
              placeholder="Ej: 2022"
              value={formData.anio}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Póliza de Aseguranza:</label>
            <input
              type="text"
              className="form-input"
              name="poliza"
              placeholder="Número de póliza"
              value={formData.poliza}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Cantidad de Pasajeros:</label>
            <input
              type="number"
              className="form-input"
              name="cantidadPasajeros"
              placeholder="Ej: 45"
              value={formData.cantidadPasajeros}
              onChange={handleChange}
            />
          </div>

          <button
            type="button"
            className="btn-generate"
            onClick={generarQR}
          >
            Generar QR
          </button>

          {qrCode && (
            <div className="qr-result">
              <img src={qrCode} alt="Código QR" className="qr-image" />
              <button
                type="button"
                className="btn-print"
                onClick={imprimirQR}
              >
                Imprimir QR
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GenerarQR;
