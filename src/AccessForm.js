
import React, { useState } from 'react';

const initialState = {
  tipoUnidad: '',
  numeroUnidad: '',
  conductor: '',
  empresa: '',
  modelo: '',
  placas: '',
  anio: '',
  poliza: '',
  movimiento: 'entrada',
};

function AccessForm({ onSubmit }) {
  const [form, setForm] = useState(initialState);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Registrar automáticamente al seleccionar Entrada o Salida
  const registrarMovimiento = movimiento => {
    const nuevoRegistro = { ...form, movimiento };
    onSubmit && onSubmit(nuevoRegistro);
    setForm(initialState);
  };

  return (
    <form className="card" style={{ maxWidth: 420 }}>
      <h2 style={{ color: 'var(--color-primary)', marginBottom: 16, fontWeight: 700 }}>Información de la Unidad</h2>
      <label style={{ color: 'var(--color-text)', fontWeight: 500 }}>
        Tipo de Unidad:
        <select
          className="select"
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
      </label>
      <label style={{ color: 'var(--color-text)', fontWeight: 500 }}>
        Número de Unidad:
        <input className="input" name="numeroUnidad" value={form.numeroUnidad} onChange={handleChange} required
          placeholder="Ej: 1234, ABC-123" title="Ingresa el número o identificador de la unidad" />
      </label>
      <label style={{ color: 'var(--color-text)', fontWeight: 500 }}>
        Conductor:
        <input className="input" name="conductor" value={form.conductor} onChange={handleChange} required
          placeholder="Nombre completo del conductor" title="Nombre del conductor de la unidad" />
      </label>
      <label style={{ color: 'var(--color-text)', fontWeight: 500 }}>
        Empresa:
        <input className="input" name="empresa" value={form.empresa} onChange={handleChange} required
          placeholder="Nombre de la empresa" title="Empresa propietaria o responsable de la unidad" />
      </label>
      <label style={{ color: 'var(--color-text)', fontWeight: 500 }}>
        Modelo del Vehículo:
        <input className="input" name="modelo" value={form.modelo} onChange={handleChange} required
          placeholder="Ej: Versa 2022" title="Modelo y año del vehículo" />
      </label>
      <label style={{ color: 'var(--color-text)', fontWeight: 500 }}>
        Placas:
        <input className="input" name="placas" value={form.placas} onChange={handleChange} required
          placeholder="Ej: ABC-123-CD" title="Placas del vehículo" />
      </label>
      <label style={{ color: 'var(--color-text)', fontWeight: 500 }}>
        Año del Vehículo:
        <input className="input" name="anio" value={form.anio} onChange={handleChange} required
          placeholder="Ej: 2022" title="Año de fabricación del vehículo" />
      </label>
      <label style={{ color: 'var(--color-text)', fontWeight: 500 }}>
        Póliza de Aseguranza:
        <input className="input" name="poliza" value={form.poliza} onChange={handleChange} required
          placeholder="Número de póliza" title="Número de póliza de seguro vigente" />
      </label>
      <div style={{ display: 'flex', gap: 16, margin: '16px 0' }}>
        <button
          type="button"
          className={`btn ${form.movimiento === 'entrada' ? 'btn-success' : ''}`}
          style={{ flex: 1, justifyContent: 'center', fontWeight: 700, fontSize: 18, boxShadow: 'none' }}
          onClick={() => registrarMovimiento('entrada')}
          title="Registrar como entrada"
        >
          <span style={{ fontSize: 22, marginRight: 6 }}>⏎</span> Entrada
        </button>
        <button
          type="button"
          className={`btn ${form.movimiento === 'salida' ? 'btn-danger' : ''}`}
          style={{ flex: 1, justifyContent: 'center', fontWeight: 700, fontSize: 18, boxShadow: 'none' }}
          onClick={() => registrarMovimiento('salida')}
          title="Registrar como salida"
        >
          <span style={{ fontSize: 22, marginRight: 6 }}>⇨</span> Salida
        </button>
      </div>
    </form>
  );
}

export default AccessForm;
