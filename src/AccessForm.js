import React, { useState, useEffect } from 'react';
import './styles/AccessForm.css';

const initialState = {
  tipoUnidad: '',
  numeroUnidad: '',
  numeroSerie: '',
  conductor: '',
  empresa: '',
  modelo: '',
  placas: '',
  anio: '',
  poliza: '',
  movimiento: 'entrada',
  cantidadPasajeros: '',
};

function AccessForm({ onSubmit, initialData }) {
  const [form, setForm] = useState(() => {
    const saved = localStorage.getItem('accessFormData');
    return saved ? JSON.parse(saved) : { ...initialState, ...initialData };
  });

  useEffect(() => {
    localStorage.setItem('accessFormData', JSON.stringify(form));
  }, [form]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const registrarMovimiento = movimiento => {
    const nuevoRegistro = { ...form, movimiento };
    onSubmit && onSubmit(nuevoRegistro);
    setForm(initialState);
    localStorage.removeItem('accessFormData');
  };

  const handleRefresh = () => {
    localStorage.removeItem('accessFormData');
    setForm(initialState);
  };

  useEffect(() => {
    if (initialData && Object.keys(initialData).length) {
      setForm(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  return (
    <form className="access-form card">
      <div className="form-header">
        <h2 className="form-title">Información de la Unidad</h2>
        <button type="button" onClick={handleRefresh} className="btn-icon">
          <img src="./assets/refrech2.png" alt="Refresh" width="24" height="24" />
        </button>
      </div>
      
      <div className="form-body">
        <div className="form-group">
          <label className="form-label">Tipo de Unidad:</label>
          <select
            className="form-select"
            name="tipoUnidad"
            value={form.tipoUnidad}
            onChange={handleChange}
            required
            title="Selecciona el tipo de unidad (automóvil, camión, tráiler, etc.)"
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
            className="form-input"
            name="numeroUnidad"
            value={form.numeroUnidad}
            onChange={handleChange}
            required
            placeholder="Ej: 1234, ABC-123"
            title="Ingresa el número o identificador de la unidad"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Conductor:</label>
          <input
            className="form-input"
            name="conductor"
            value={form.conductor}
            onChange={handleChange}
            required
            placeholder="Nombre completo del conductor"
            title="Nombre del conductor de la unidad"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Empresa:</label>
          <input
            className="form-input"
            name="empresa"
            value={form.empresa}
            onChange={handleChange}
            required
            placeholder="Nombre de la empresa"
            title="Empresa propietaria o responsable de la unidad"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Modelo del Vehículo:</label>
          <input
            className="form-input"
            name="modelo"
            value={form.modelo}
            onChange={handleChange}
            required
            placeholder="Ej: Versa 2022"
            title="Modelo y año del vehículo"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Número de Serie:</label>
          <input
            className="form-input"
            name="numeroSerie"
            value={form.numeroSerie}
            onChange={handleChange}
            placeholder="Ej: 1HGCM82633A123456"
            title="Número de serie (VIN) del vehículo"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Placas:</label>
          <input
            className="form-input"
            name="placas"
            value={form.placas}
            onChange={handleChange}
            required
            placeholder="Ej: ABC-123-CD"
            title="Placas del vehículo"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Año del Vehículo:</label>
          <input
            className="form-input"
            name="anio"
            value={form.anio}
            onChange={handleChange}
            required
            placeholder="Ej: 2022"
            title="Año de fabricación del vehículo"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Póliza de Aseguranza:</label>
          <input
            className="form-input"
            name="poliza"
            value={form.poliza}
            onChange={handleChange}
            required
            placeholder="Número de póliza"
            title="Número de póliza de seguro vigente"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Cantidad de Pasajeros:</label>
          <input
            type="number"
            className="form-input"
            name="cantidadPasajeros"
            value={form.cantidadPasajeros}
            onChange={handleChange}
            placeholder="Ej: 45"
          />
        </div>
      </div>

      <div className="form-actions">
        <button
          type="button"
          className={`btn btn-entrada ${form.movimiento === 'entrada' ? 'active' : ''}`}
          onClick={() => registrarMovimiento('entrada')}
          title="Registrar como entrada"
        >
          <span className="btn-icon">⏎</span> Entrada
        </button>
        <button
          type="button"
          className={`btn btn-salida ${form.movimiento === 'salida' ? 'active' : ''}`}
          onClick={() => registrarMovimiento('salida')}
          title="Registrar como salida"
        >
          <span className="btn-icon">⇨</span> Salida
        </button>
      </div>
    </form>
  );
}

export default AccessForm;
