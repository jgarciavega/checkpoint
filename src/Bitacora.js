
import React, { useState, useMemo, useEffect } from 'react';

function Bitacora({ registros = [], formato = 'completo', onAddDummy }) {
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

  // Añadir datos ficticios: si se provee `onAddDummy` lo usa para actualizar en memoria (sin recargar)
  const addDummyData = (countOrPages) => {
    try {
      // Permitir que el usuario pase número de páginas (enteras) o conteo directo
      const pages = Number(countOrPages) && Number(countOrPages) > 0 ? Number(countOrPages) : 0;
      const count = pages > 0 ? pages * pageSize : Number(countOrPages) || pageSize * 2;
      const now = Date.now();
      const nuevos = [];
      for (let i = 0; i < count; i++) {
        const fecha = new Date(now - i * 60000).toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'medium' });
        const movimiento = i % 2 === 0 ? 'entrada' : 'salida';
        nuevos.push({
          fecha,
          tipoUnidad: ['Automóvil','Camión','Trailer'][i%3],
          numeroUnidad: `UNIT-${Math.floor(Math.random()*9000+1000)}`,
          numeroSerie: `VIN${Math.floor(Math.random()*9000000)}`,
          conductor: `Conductor ${i+1}`,
          empresa: `Empresa ${((i%5)+1)}`,
          modelo: `Modelo ${2000 + (i%25)}`,
          placas: `PLQ${Math.floor(Math.random()*900+100)}`,
          anio: `${2000 + (i%25)}`,
          poliza: `P-${Math.floor(Math.random()*90000+10000)}`,
          movimiento,
          folio: `F${Math.floor(Math.random()*90000+10000)}-${Date.now().toString().slice(-6)}`
        });
      }
      if (typeof onAddDummy === 'function') {
        onAddDummy(nuevos);
      } else {
        const existing = JSON.parse(localStorage.getItem('registrosBitacora')) || registros || [];
        localStorage.setItem('registrosBitacora', JSON.stringify(nuevos.concat(existing)));
        window.location.reload();
      }
    } catch (e) {
      console.error('Error añadiendo datos ficticios', e);
      alert('No fue posible añadir datos de prueba. Revisa la consola.');
    }
  };

  // Paginación
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [dummyPages, setDummyPages] = useState(2);

  useEffect(() => {
    // Si cambian registros o tamaño de página, asegurar página válida
    const totalPages = Math.max(1, Math.ceil(registros.length / pageSize));
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [registros.length, pageSize]);

  const totalPages = Math.max(1, Math.ceil(registros.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const pageRegistros = registros.slice(startIndex, endIndex);

  // Generar lista de páginas para mostrar (window con elipsis)
  function getPageList(total, current) {
    const delta = 2; // páginas alrededor
    const range = [];
    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
        range.push(i);
      } else if (range[range.length - 1] !== '...') {
        range.push('...');
      }
    }
    return range;
  }
  const pageList = getPageList(totalPages, currentPage);

  return (
    <section className="card" style={{ width: '100%', maxWidth: 1200, minWidth: 320, margin: '0 auto' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
        <h2 style={{ color: 'var(--color-primary)', margin:0, fontWeight: 700 }}>
          Bitácora de Entradas <span style={{ color: 'var(--color-accent)', fontSize: 16, marginLeft:8 }}>({registros.length})</span>
        </h2>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <label style={{ fontSize: 12, color: 'var(--color-muted)' }}>Páginas:</label>
          <input type="number" min={1} value={dummyPages} onChange={e => setDummyPages(Number(e.target.value) || 1)} style={{ width:72, padding:'6px 8px', borderRadius:6, border:'1px solid rgba(15,23,42,0.08)' }} aria-label="Páginas de prueba" />
          <button className="btn small" onClick={() => addDummyData(dummyPages)} title="Crear datos de prueba">Crear datos de prueba</button>
        </div>
      </div>
      <div className="timeline">
        {registros.length === 0 ? (
          <div style={{ color: 'var(--color-muted)', fontWeight: 500, fontSize: 18, padding: 32, textAlign: 'center' }}>
            No hay registros aún.
          </div>
        ) : (
          pageRegistros.map((r, i) => (
            <div
              key={startIndex + i}
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

      {/* Paginación */}
      {registros.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
          <div style={{ color: 'var(--color-muted)', fontSize: 13 }}>
            Mostrando <strong>{startIndex + 1}</strong> - <strong>{Math.min(endIndex, registros.length)}</strong> de <strong>{registros.length}</strong>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setCurrentPage(1); }} style={{ padding: '6px 8px', borderRadius: 6 }} aria-label="Registros por página">
              <option value={5}>5 / página</option>
              <option value={10}>10 / página</option>
              <option value={25}>25 / página</option>
              <option value={50}>50 / página</option>
            </select>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <button className="btn small" onClick={() => setCurrentPage(1)} disabled={currentPage === 1} aria-label="Primera página">«</button>
              <button className="btn small" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} aria-label="Página anterior">‹</button>

              <div className="pagination-numbers" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                {pageList.map((p, idx) => (
                  p === '...'
                    ? <span key={`dot-${idx}`} style={{ padding: '6px 8px', color: 'var(--color-muted)' }}>…</span>
                    : (
                      <button
                        key={p}
                        className={`btn small ${p === currentPage ? 'active' : ''}`}
                        onClick={() => setCurrentPage(p)}
                        aria-label={`Ir a la página ${p}`}
                      >{p}</button>
                    )
                ))}
              </div>

              <button className="btn small" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} aria-label="Página siguiente">›</button>
              <button className="btn small" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} aria-label="Última página">»</button>
            </div>
            <div style={{ display:'flex', gap:6, alignItems:'center', marginLeft:8 }}>
              <label style={{fontSize:12,color:'var(--color-muted)'}}>Ir a:</label>
              <input type="number" min={1} max={totalPages} value={currentPage} onChange={e => {
                const v = Number(e.target.value) || 1; setCurrentPage(Math.min(Math.max(1, v), totalPages));
              }} style={{ width:64, padding:'6px 8px', borderRadius:6, border:'1px solid rgba(15,23,42,0.08)' }} aria-label="Ir a la página" />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Bitacora;
