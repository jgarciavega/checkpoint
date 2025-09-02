import React, { useState, useEffect } from 'react';

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
  cantidadPasajeros: '', // Nuevo campo agregado al estado inicial
};

function AccessForm({ onSubmit, initialData }) {
  const [form, setForm] = useState(() => {
    const saved = localStorage.getItem('accessFormData');
    return saved ? JSON.parse(saved) : { ...initialState, ...initialData };
  });
  const [mode, setMode] = useState('light'); // Estado para el modo claro/oscuro

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
    <form
      style={{
        padding: '20px',
        border: '1px solid',
        borderColor: mode === 'dark' ? '#1e3a5f' : '#ddd',
        borderRadius: '10px',
        backgroundColor: mode === 'dark' ? '#2c3e50' : '#fff',
        color: mode === 'dark' ? '#e0e0e0' : '#000',
        boxShadow: mode === 'dark' ? '0 4px 8px rgba(0, 0, 0, 0.7)' : '0 4px 8px rgba(0, 0, 0, 0.1)',
        position: 'relative',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <h2
          style={{
            fontWeight: 'bold',
            fontSize: '1.5rem',
            color: mode === 'dark' ? '#cfd8dc' : '#333',
          }}
        >
          Información de la Unidad
        </h2>
        <button
          type="button"
          onClick={handleRefresh}
          style={{
            padding: '10px',
            borderRadius: '80%',
            backgroundColor: mode === 'dark' ? '#1e3a5f' : '#cfd72c',
            color: mode === 'dark' ? '#cfd8dc' : '#5721d6',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src="./assets/refrech2.png"
            alt="Refresh"
            style={{ width: '24px', height: '24px' }}
          />
        </button>
      </div>
      <div
        style={{
          flex: '1 1 calc(50% - 10px)',
          minWidth: '250px',
        }}
      >
        <label
          style={{
            fontWeight: 'bold',
            color: mode === 'dark' ? '#b0c4de' : '#333',
            marginBottom: '5px',
            display: 'block',
          }}
        >
          Tipo de Unidad:
        </label>
        <select
          className="select"
          name="tipoUnidad"
          value={form.tipoUnidad}
          onChange={handleChange}
          required
          title="Selecciona el tipo de unidad (automóvil, camión, tráiler, etc.)"
          style={{
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid',
            borderColor: mode === 'dark' ? '#1e3a5f' : '#ccc',
            width: '100%',
            fontSize: '16px',
            backgroundColor: mode === 'dark' ? '#34495e' : '#f9f9f9',
            color: mode === 'dark' ? '#e0e0e0' : '#333',
          }}
        >
          <option value="">Seleccionar...</option>
          <option value="Automóvil">Automóvil</option>
          <option value="Camión">Camión</option>
          <option value="Trailer">Trailer</option>
          <option value="Otro">Otro</option>
        </select>
      </div>
      <div
        style={{
          flex: '1 1 calc(50% - 10px)',
          minWidth: '250px',
        }}
      >
        <label
          style={{
            fontWeight: 'bold',
            color: mode === 'dark' ? '#b0c4de' : '#333',
            marginBottom: '5px',
            display: 'block',
          }}
        >
          Número de Unidad:
        </label>
        <input
          className="input"
          name="numeroUnidad"
          value={form.numeroUnidad}
          onChange={handleChange}
          required
          placeholder="Ej: 1234, ABC-123"
          title="Ingresa el número o identificador de la unidad"
          style={{
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid',
            borderColor: mode === 'dark' ? '#1e3a5f' : '#ccc',
            width: '100%',
            fontSize: '16px',
            backgroundColor: mode === 'dark' ? '#1e293b' : '#f9f9f9',
            color: mode === 'dark' ? '#e0e0e0' : '#333',
          }}
        />
      </div>
      <div
        style={{
          flex: '1 1 calc(50% - 10px)',
          minWidth: '250px',
        }}
      >
        <label
          style={{
            fontWeight: 'bold',
            color: mode === 'dark' ? '#b0c4de' : '#333',
            marginBottom: '5px',
            display: 'block',
          }}
        >
          Conductor:
        </label>
        <input
          className="input"
          name="conductor"
          value={form.conductor}
          onChange={handleChange}
          required
          placeholder="Nombre completo del conductor"
          title="Nombre del conductor de la unidad"
          style={{
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid',
            borderColor: mode === 'dark' ? '#1e3a5f' : '#ccc',
            width: '100%',
            fontSize: '16px',
            backgroundColor: mode === 'dark' ? '#1e293b' : '#f9f9f9',
            color: mode === 'dark' ? '#e0e0e0' : '#333',
          }}
        />
      </div>
      <div
        style={{
          flex: '1 1 calc(50% - 10px)',
          minWidth: '250px',
        }}
      >
        <label
          style={{
            fontWeight: 'bold',
            color: mode === 'dark' ? '#b0c4de' : '#333',
            marginBottom: '5px',
            display: 'block',
          }}
        >
          Empresa:
        </label>
        <input
          className="input"
          name="empresa"
          value={form.empresa}
          onChange={handleChange}
          required
          placeholder="Nombre de la empresa"
          title="Empresa propietaria o responsable de la unidad"
          style={{
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid',
            borderColor: mode === 'dark' ? '#1e3a5f' : '#ccc',
            width: '100%',
            fontSize: '16px',
            backgroundColor: mode === 'dark' ? '#1e293b' : '#f9f9f9',
            color: mode === 'dark' ? '#e0e0e0' : '#333',
          }}
        />
      </div>
      <div
        style={{
          flex: '1 1 calc(50% - 10px)',
          minWidth: '250px',
        }}
      >
        <label
          style={{
            fontWeight: 'bold',
            color: mode === 'dark' ? '#b0c4de' : '#333',
            marginBottom: '5px',
            display: 'block',
          }}
        >
          Modelo del Vehículo:
        </label>
        <input
          className="input"
          name="modelo"
          value={form.modelo}
          onChange={handleChange}
          required
          placeholder="Ej: Versa 2022"
          title="Modelo y año del vehículo"
          style={{
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid',
            borderColor: mode === 'dark' ? '#1e3a5f' : '#ccc',
            width: '100%',
            fontSize: '16px',
            backgroundColor: mode === 'dark' ? '#1e293b' : '#f9f9f9',
            color: mode === 'dark' ? '#e0e0e0' : '#333',
          }}
        />
      </div>
      <div
        style={{
          flex: '1 1 calc(50% - 10px)',
          minWidth: '250px',
        }}
      >
        <label
          style={{
            fontWeight: 'bold',
            color: mode === 'dark' ? '#b0c4de' : '#333',
            marginBottom: '5px',
            display: 'block',
          }}
        >
          Placas:
        </label>
        <input
          className="input"
          name="placas"
          value={form.placas}
          onChange={handleChange}
          required
          placeholder="Ej: ABC-123-CD"
          title="Placas del vehículo"
          style={{
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid',
            borderColor: mode === 'dark' ? '#1e3a5f' : '#ccc',
            width: '100%',
            fontSize: '16px',
            backgroundColor: mode === 'dark' ? '#1e293b' : '#f9f9f9',
            color: mode === 'dark' ? '#e0e0e0' : '#333',
          }}
        />
      </div>
      <div
        style={{
          flex: '1 1 calc(50% - 10px)',
          minWidth: '250px',
        }}
      >
        <label
          style={{
            fontWeight: 'bold',
            color: mode === 'dark' ? '#b0c4de' : '#333',
            marginBottom: '5px',
            display: 'block',
          }}
        >
          Año del Vehículo:
        </label>
        <input
          className="input"
          name="anio"
          value={form.anio}
          onChange={handleChange}
          required
          placeholder="Ej: 2022"
          title="Año de fabricación del vehículo"
          style={{
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid',
            borderColor: mode === 'dark' ? '#1e3a5f' : '#ccc',
            width: '100%',
            fontSize: '16px',
            backgroundColor: mode === 'dark' ? '#1e293b' : '#f9f9f9',
            color: mode === 'dark' ? '#e0e0e0' : '#333',
          }}
        />
      </div>
      <div
        style={{
          flex: '1 1 calc(50% - 10px)',
          minWidth: '250px',
        }}
      >
        <label
          style={{
            fontWeight: 'bold',
            color: mode === 'dark' ? '#b0c4de' : '#333',
            marginBottom: '5px',
            display: 'block',
          }}
        >
          Póliza de Aseguranza:
        </label>
        <input
          className="input"
          name="poliza"
          value={form.poliza}
          onChange={handleChange}
          required
          placeholder="Número de póliza"
          title="Número de póliza de seguro vigente"
          style={{
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid',
            borderColor: mode === 'dark' ? '#1e3a5f' : '#ccc',
            width: '100%',
            fontSize: '16px',
            backgroundColor: mode === 'dark' ? '#1e293b' : '#f9f9f9',
            color: mode === 'dark' ? '#e0e0e0' : '#333',
          }}
        />
      </div>
      <div
        style={{
          flex: '1 1 calc(50% - 10px)',
          minWidth: '250px',
        }}
      >
        <label
          style={{
            fontWeight: 'bold',
            color: mode === 'dark' ? '#b0c4de' : '#333',
            marginBottom: '5px',
            display: 'block',
          }}
        >
          Cantidad de Pasajeros:
        </label>
        <input
          type="number"
          name="cantidadPasajeros"
          placeholder="Ej: 45"
          value={form.cantidadPasajeros}
          onChange={handleChange}
          style={{
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid',
            borderColor: mode === 'dark' ? '#1e3a5f' : '#ccc',
            width: '100%',
            fontSize: '16px',
            backgroundColor: mode === 'dark' ? '#1e293b' : '#f9f9f9',
            color: mode === 'dark' ? '#e0e0e0' : '#333',
          }}
        />
      </div>
      <div
        style={{
          flex: '1 1 100%',
          display: 'flex',
          gap: '10px',
          marginTop: '20px',
        }}
      >
        <button
          type="button"
          className={`btn ${form.movimiento === 'entrada' ? 'btn-success' : ''}`}
          style={{
            flex: 1,
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: 18,
            boxShadow: 'none',
            padding: '12px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: form.movimiento === 'entrada' ? '#28a745' : '#007bff',
            color: '#fff',
          }}
          onClick={() => registrarMovimiento('entrada')}
          title="Registrar como entrada"
        >
          <span style={{ fontSize: 22, marginRight: 6 }}>⏎</span> Entrada
        </button>
        <button
          type="button"
          className={`btn ${form.movimiento === 'salida' ? 'btn-danger' : ''}`}
          style={{
            flex: 1,
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: 18,
            boxShadow: 'none',
            padding: '12px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: form.movimiento === 'salida' ? '#dc3545' : '#007bff',
            color: '#fff',
          }}
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
