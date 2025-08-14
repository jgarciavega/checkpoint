import React from 'react';
import logoImg from './assets/Api.png';
import qrIcon from './assets/qr.png';
import formIcon from './assets/foam.png';
import bitacoraIcon from './assets/bitacora.png';
import configIcon from './assets/config.png';
import './Navbar.css';

const Navbar = ({ active, onSelect, modoOscuro, onToggleModo, fechaHora, onLogout }) => {
  const items = [
    { key: 'scanner', label: 'Escáner', icon: qrIcon },
    { key: 'form', label: 'Formulario', icon: formIcon },
    { key: 'bitacora', label: 'Bitácora', icon: bitacoraIcon },
    { key: 'config', label: 'Configuración', icon: configIcon },
  ];
  return (
    <nav className="navbar">
      {/* logo secundario a la izquierda (se oculta mientras el overlay global esté activo) */}
      {active && (
        <img src={logoImg} alt="Logo" style={{ width: 110, height: 110, objectFit: 'contain', filter: 'drop-shadow(0 2px 8px #0005)', marginRight: 72 }} />
      )}
      {/* menu siempre presente, pero puede ser visualmente cubierto por el overlay */}
      <ul className="navbar-list">
        {items.map(item => (
          <li
            key={item.key}
            className={active === item.key ? 'active' : ''}
            onClick={() => onSelect(item.key)}
          >
            <span className="navbar-icon">
              <img src={item.icon} alt={item.label} style={{ width: 26, height: 26, objectFit: 'contain', verticalAlign: 'middle' }} />
            </span>
            <span className="navbar-label">{item.label}</span>
          </li>
        ))}
      </ul>
  {/* overlay local eliminado: usamos el overlay global desde App.js */}
      <div style={{ flex: 1 }} />
      <div className="navbar-fecha-hora" style={{ fontWeight: 500, fontSize: '1.08rem', color: '#fff', marginRight: 38 }}>
        {fechaHora}
      </div>
      <button
        className="navbar-modo-btn"
        onClick={onToggleModo}
        style={{
          background: modoOscuro ? '#fff' : '#1e293b',
          color: modoOscuro ? '#1e293b' : '#fff',
          border: '1.5px solid #2563eb',
          borderRadius: 8,
          padding: '7px 18px',
          fontWeight: 700,
          fontSize: '1.01rem',
          marginLeft: 0,
          marginRight: 32,
          cursor: 'pointer',
          transition: 'background 0.18s, color 0.18s',
        }}
        title={modoOscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      >
        {modoOscuro ? '🌙 Oscuro' : '☀️ Claro'}
      </button>
    </nav>
  );
};

export default Navbar;
