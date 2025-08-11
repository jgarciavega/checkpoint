
import React, { useState, useEffect } from 'react';
import emailIcon from './assets/email (1).png';
import excelIcon from './assets/excel.png';
import pdfIcon from './assets/pdf.png';
import printIcon from './assets/impresora.png';
import whatsappIcon from './assets/what.png';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Simulación: importar registros de la bitácora
import { registros as registrosBitacora } from './Bitacora';

const defaultConfig = {
  modoOscuro: 'auto',
  tamanoTexto: 'normal',
  correo: '',
  whatsapp: '',
  formatoRegistro: 'completo',
};


function Configuracion({ onConfigChange }) {
  const [config, setConfig] = useState(defaultConfig);

  useEffect(() => {
    const saved = localStorage.getItem('configuracionApp');
    if (saved) setConfig(JSON.parse(saved));
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setConfig(prev => {
      const updated = { ...prev, [name]: value };
      localStorage.setItem('configuracionApp', JSON.stringify(updated));
      if (onConfigChange) onConfigChange(updated);
      return updated;
    });
  };

  // Exportar a Excel
  const exportarExcel = () => {
    const ws = XLSX.utils.json_to_sheet(registrosBitacora);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Bitacora');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'bitacora.xlsx');
  };

  // Exportar a PDF
  const exportarPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      startY: 22,
      head: [[
        'Fecha', 'Tipo', 'Unidad', 'Conductor', 'Movimiento', 'Folio'
      ]],
      body: registrosBitacora.map(r => [
        r.fecha, r.tipo, r.unidad, r.conductor, r.movimiento, r.folio
      ]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [37, 99, 235] },
    });
    doc.text('Bitácora de Entradas', 14, 16);
    doc.save('bitacora.pdf');
  };

  // Enviar por correo (mailto, sin adjunto automático)
  const enviarCorreo = () => {
    const destinatario = config.correo || '';
    const asunto = encodeURIComponent('Bitácora de Entradas');
    const cuerpo = encodeURIComponent('Adjunto la bitácora del día. (Recuerda adjuntar el archivo exportado desde la app)');
    window.open(`mailto:${destinatario}?subject=${asunto}&body=${cuerpo}`);
  };

  // Enviar por WhatsApp (wa.me, sin adjunto automático)
  const enviarWhatsApp = () => {
    let numero = config.whatsapp.replace(/[^\d]/g, '');
    if (numero.startsWith('52')) numero = numero; // México
    else if (numero.length === 10) numero = '52' + numero;
    const mensaje = encodeURIComponent('Adjunto la bitácora del día. (Recuerda adjuntar el archivo exportado desde la app)');
    window.open(`https://wa.me/${numero}?text=${mensaje}`);
  };

  // Imprimir solo la bitácora con los campos actuales
  const imprimirBitacora = () => {
    // Crear ventana temporal para impresión
    const printWindow = window.open('', '', 'width=900,height=700');
    const campos = [
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
    // Generar tabla HTML
    const tabla = `
      <style>
        body { font-family: 'Poppins', Arial, sans-serif; color: #1e293b; background: #f4f6fb; }
        h2 { color: #2563eb; }
        table { border-collapse: collapse; width: 100%; margin-top: 18px; }
        th, td { border: 1.5px solid #2563eb; padding: 8px 10px; font-size: 1rem; }
        th { background: #e11d48; color: #fff; font-weight: 700; }
        tr:nth-child(even) { background: #f9fafb; }
      </style>
      <h2>Bitácora de Entradas y Salidas</h2>
      <table>
        <thead>
          <tr>
            ${campos.map(c => `<th>${c.label}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${registrosBitacora.map(r => `
            <tr>
              ${campos.map(c => `<td>${r[c.key] || ''}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    printWindow.document.write(tabla);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 300);
  };

  return (
    <section className="card" style={{ maxWidth: 420 }}>
      <h2 style={{ color: 'var(--color-primary)', marginBottom: 16, fontWeight: 700 }}>Configuración</h2>
      <form>
        <label style={{ color: 'var(--color-text)', fontWeight: 500 }}>
          Modo oscuro:
          <select className="select" name="modoOscuro" value={config.modoOscuro} onChange={handleChange}>
            <option value="auto">Automático</option>
            <option value="claro">Claro</option>
            <option value="oscuro">Oscuro</option>
          </select>
        </label>
        <label style={{ color: 'var(--color-text)', fontWeight: 500 }}>
          Tamaño de texto:
          <select className="select" name="tamanoTexto" value={config.tamanoTexto} onChange={handleChange}>
            <option value="normal">Normal</option>
            <option value="grande">Grande</option>
            <option value="extra">Extra grande</option>
          </select>
        </label>
        <label style={{ color: 'var(--color-text)', fontWeight: 500 }}>
          Correo para notificaciones:
          <input className="input" name="correo" type="email" placeholder="correo@ejemplo.com" value={config.correo} onChange={handleChange} />
        </label>
        <label style={{ color: 'var(--color-text)', fontWeight: 500 }}>
          WhatsApp para alertas:
          <input className="input" name="whatsapp" type="tel" placeholder="+52 612 123 4567" value={config.whatsapp} onChange={handleChange} />
        </label>
        <label style={{ color: 'var(--color-text)', fontWeight: 500 }}>
          Formato de registro:
          <select className="select" name="formatoRegistro" value={config.formatoRegistro} onChange={handleChange}>
            <option value="completo">Completo</option>
            <option value="reducido">Reducido</option>
          </select>
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, marginTop: 24 }}>
          <div style={{ display: 'flex', gap: 28, justifyContent: 'center', marginBottom: 10 }}>
            <button className="btn" type="button" style={{ background: '#2563eb', borderRadius: '50%', width: 54, height: 54, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px 0 rgba(37,99,235,0.10)', padding: 0 }} onClick={enviarCorreo} title="Enviar por correo">
              <img src={emailIcon} alt="Correo" style={{ width: 30, height: 30 }} />
            </button>
            <button className="btn" type="button" style={{ background: '#25d366', borderRadius: '50%', width: 54, height: 54, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px 0 rgba(37,99,235,0.10)', padding: 0 }} onClick={enviarWhatsApp} title="Enviar por WhatsApp">
              <img src={whatsappIcon} alt="WhatsApp" style={{ width: 30, height: 30 }} />
            </button>
            <button className="btn" type="button" style={{ background: '#22c55e', borderRadius: '50%', width: 54, height: 54, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px 0 rgba(37,99,235,0.10)', padding: 0 }} onClick={exportarExcel} title="Exportar a Excel">
              <img src={excelIcon} alt="Excel" style={{ width: 30, height: 30 }} />
            </button>
            <button className="btn" type="button" style={{ background: '#e11d48', borderRadius: '50%', width: 54, height: 54, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px 0 rgba(37,99,235,0.10)', padding: 0 }} onClick={exportarPDF} title="Exportar a PDF">
              <img src={pdfIcon} alt="PDF" style={{ width: 30, height: 30 }} />
            </button>
            <button className="btn" type="button" style={{ background: '#444', borderRadius: '50%', width: 54, height: 54, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px 0 rgba(37,99,235,0.10)', padding: 0 }} onClick={imprimirBitacora} title="Imprimir Bitácora">
              <img src={printIcon} alt="Imprimir" style={{ width: 30, height: 30 }} />
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}

export default Configuracion;
