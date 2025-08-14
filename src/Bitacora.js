
import React from 'react';

function Bitacora({ registros = [], formato = 'completo' }) {
  // Definir campos a mostrar según formato
  const camposReducido = [
    { label: 'Fecha', key: 'fecha' },
    { label: 'Tipo de Unidad', key: 'tipoUnidad' },
    { label: 'Número de Unidad', key: 'numeroUnidad' },
    { label: 'Conductor', key: 'conductor' },
    { label: 'Movimiento', key: 'movimiento' },
    { label: 'Folio', key: 'folio' },
  ];
  const camposCompleto = [
    { label: 'Fecha', key: 'fecha' },
    { label: 'Tipo de Unidad', key: 'tipoUnidad' },
    { label: 'Número de Unidad', key: 'numeroUnidad' },
    { label: 'Conductor', key: 'conductor' },
    { label: 'Empresa', key: 'empresa' },
    { label: 'Modelo', key: 'modelo' },
    { label: 'Placas', key: 'placas' },
    { label: 'Año', key: 'anio' },
    { label: 'Póliza', key: 'poliza' },
    { label: 'Movimiento', key: 'movimiento' },
    { label: 'Folio', key: 'folio' },
  ];
  const campos = formato === 'reducido' ? camposReducido : camposCompleto;

  return (
    <section className="card" style={{ width: '100%', maxWidth: 1200, minWidth: 320, margin: '0 auto' }}>
      <h2 style={{ color: 'var(--color-primary)', marginBottom: 12, fontWeight: 700 }}>
        Bitácora de Entradas <span style={{ color: 'var(--color-accent)', fontSize: 18 }}>({registros.length})</span>
      </h2>
      <div className="timeline">
        {registros.length === 0 ? (
          <div style={{ color: 'var(--color-muted)', fontWeight: 500, fontSize: 18, padding: 32, textAlign: 'center' }}>
            No hay registros aún.
          </div>
        ) : (
          registros.map((r, i) => (
            <div
              key={i}
              className={`timeline-item ${r.movimiento}`}
              style={{ borderLeftWidth: 6 }}
            >
              <div className="timeline-date">{r.fecha}</div>
              <div className="timeline-info-grid">
                {campos.map(c => (
                  r[c.key] && c.key !== 'fecha' && c.key !== 'movimiento' && c.key !== 'folio' ? (
                    <div key={c.key} className="timeline-info-cell"><b>{c.label}:</b> {r[c.key]}</div>
                  ) : null
                ))}
                <div className="timeline-info-cell" style={{ gridColumn: '1 / -1', marginTop: 8 }}>
                  <b>Movimiento:</b>
                  <span className={`timeline-badge ${r.movimiento}`}>{r.movimiento ? r.movimiento.toUpperCase() : ''}</span>
                  <span style={{ color: 'var(--color-muted)', marginLeft: 12, fontSize: 13 }}>{r.folio}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default Bitacora;
