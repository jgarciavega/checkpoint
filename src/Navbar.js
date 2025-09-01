import React, { useState, useEffect } from 'react';
import logoImg from './assets/Api.png';
import qrIcon from './assets/qr.png';
import formIcon from './assets/foam.png';
import bitacoraIcon from './assets/bitacora.png';
import configIcon from './assets/config.png';
import './Navbar.css';

const Navbar = ({ active, onSelect, modoOscuro, onToggleModo, fechaHora, onLogout }) => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Elementos para móvil (incluye scanner)
  const mobileItems = [
    { key: 'scanner', label: 'Escáner', icon: qrIcon },
    { key: 'form', label: 'Formulario', icon: formIcon },
    { key: 'config', label: 'Configuración', icon: configIcon },
  ];

  // Elementos para escritorio (sin scanner, incluye bitácora)
  const desktopItems = [
    { key: 'form', label: 'Formulario', icon: formIcon },
    { key: 'bitacora', label: 'Bitácora', icon: bitacoraIcon },
    { key: 'config', label: 'Configuración', icon: configIcon },
  ];

  // Efecto para detectar cambios de tamaño de pantalla
  useEffect(() => {
    const checkIsMobile = () => {
      const newIsMobile = window.innerWidth <= 768;
      setIsMobile(newIsMobile);
      if (!newIsMobile) {
        setMenuAbierto(false); // Cerrar menú si cambiamos a desktop
      }
    };

    // Verificar inmediatamente al montar
    checkIsMobile();

    const handleResize = () => {
      checkIsMobile();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const items = isMobile ? mobileItems : desktopItems;

  const handleItemClick = (key) => {
    onSelect(key);
    setMenuAbierto(false); // Cerrar menú móvil al seleccionar
  };

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  return (
    <nav className="navbar">
      {/* Fecha y hora - ahora a la izquierda */}
      <div className={`navbar-fecha-hora ${menuAbierto ? 'navbar-fecha-hora-hidden' : ''}`}>
        {fechaHora}
      </div>
      
      {/* Hamburger Button - solo visible en móvil */}
      <button 
        className="hamburger-btn"
        onClick={toggleMenu}
        aria-label="Abrir menú"
      >
        <span className={`hamburger-line ${menuAbierto ? 'active' : ''}`}></span>
        <span className={`hamburger-line ${menuAbierto ? 'active' : ''}`}></span>
        <span className={`hamburger-line ${menuAbierto ? 'active' : ''}`}></span>
      </button>

      {/* Spacer */}
      <div className="navbar-spacer" />

      {/* Menu principal - ahora a la derecha */}
      <ul className={`navbar-list ${menuAbierto ? 'navbar-list-open' : ''}`}>
        {items.map(item => (
          <li
            key={item.key}
            className={active === item.key ? 'active' : ''}
            onClick={() => handleItemClick(item.key)}
          >
            <span className="navbar-icon">
              <img 
                src={item.icon} 
                alt={item.label} 
                style={{ 
                  width: 26, 
                  height: 26, 
                  objectFit: 'contain', 
                  verticalAlign: 'middle' 
                }} 
              />
            </span>
            <span className="navbar-label">{item.label}</span>
          </li>
        ))}
        
        {/* Botón cerrar sesión - solo visible en menú móvil */}
        <li 
          className="navbar-logout-btn"
          onClick={() => {
            onLogout();
            setMenuAbierto(false);
          }}
        >
          <span className="navbar-icon">
            🚪
          </span>
          <span className="navbar-label">Cerrar Sesión</span>
        </li>
      </ul>

      {/* Botón modo oscuro/claro - solo en móvil */}
      {isMobile && (
        <button
          className={`navbar-modo-btn ${menuAbierto ? 'navbar-modo-btn-hidden' : ''}`}
          onClick={onToggleModo}
          style={{
            background: modoOscuro ? '#fff' : '#1e293b',
            color: modoOscuro ? '#1e293b' : '#fff',
            border: '1.5px solid #2563eb',
            borderRadius: 8,
            padding: '7px 18px',
            fontWeight: 700,
            fontSize: '1.01rem',
            cursor: 'pointer',
            transition: 'background 0.18s, color 0.18s',
          }}
          title={modoOscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        >
          {modoOscuro ? '🌙 Oscuro' : '☀️ Claro'}
        </button>
      )}

      {/* Overlay para cerrar menú móvil al tocar fuera - solo en móvil */}
      {menuAbierto && isMobile && (
        <div 
          className="navbar-overlay"
          onClick={() => setMenuAbierto(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
