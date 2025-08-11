import React from 'react';

// Ejemplo de datos de bitácora (puedes conectar a tu backend o estado global)
export const registros = [
  {
    fecha: '10/8/2025, 08:15:29 a.m.',
    tipoUnidad: 'Automóvil',
    numeroUnidad: '3277',
    conductor: 'Manuel López',
    empresa: 'Transportes del Mar',
    modelo: 'Versa 2022',
    placas: 'ABC-123-CD',
    anio: '2022',
    poliza: 'POL-00112233',
    movimiento: 'salida',
    folio: 'F135-05032402',
  },
  {
    fecha: '10/8/2025, 09:05:01 a.m.',
    tipoUnidad: 'Trailer',
    numeroUnidad: '2311',
    conductor: 'Pablo García',
    empresa: 'Logística Express',
    modelo: 'Freightliner 2021',
    placas: 'XYZ-987-ZT',
    anio: '2021',
    poliza: 'POL-00998877',
    movimiento: 'entrada',
    folio: 'F135-05032403',
  },
  {
    fecha: '10/8/2025, 10:58:20 a.m.',
    tipoUnidad: 'Camión',
    numeroUnidad: '2563',
    conductor: 'Juan Pérez',
    empresa: 'Carga y Mudanzas',
    modelo: 'Isuzu ELF 2020',
    placas: 'LMN-456-OP',
    anio: '2020',
    poliza: 'POL-00445566',
    movimiento: 'entrada',
    folio: 'F135-05032408',
  },
];

function Bitacora() {
  return (
    <section className="card" style={{ maxWidth: 700 }}>
      <h2 style={{ color: 'var(--color-primary)', marginBottom: 12, fontWeight: 700 }}>
        Bitácora de Entradas <span style={{ color: 'var(--color-accent)', fontSize: 18 }}>({registros.length})</span>
      </h2>
      <div className="timeline">
        {registros.map((r, i) => (
          <div
            key={i}
            className={`timeline-item ${r.movimiento}`}
            style={{ borderLeftWidth: 6 }}
          >
            <div className="timeline-date">{r.fecha}</div>
            <div className="timeline-info">
              <span><b>Tipo:</b> {r.tipoUnidad || r.tipo} &nbsp; <b>Unidad:</b> {r.numeroUnidad || r.unidad}</span>
              <span><b>Conductor:</b> {r.conductor}</span>
              {r.empresa && <span><b>Empresa:</b> {r.empresa}</span>}
              {r.modelo && <span><b>Modelo:</b> {r.modelo}</span>}
              {r.placas && <span><b>Placas:</b> {r.placas}</span>}
              {r.anio && <span><b>Año:</b> {r.anio}</span>}
              {r.poliza && <span><b>Póliza:</b> {r.poliza}</span>}
              <span>
                <b>Movimiento:</b>
                <span className={`timeline-badge ${r.movimiento}`}>{r.movimiento ? r.movimiento.toUpperCase() : ''}</span>
                <span style={{ color: 'var(--color-muted)', marginLeft: 12, fontSize: 13 }}>{r.folio}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Bitacora;
