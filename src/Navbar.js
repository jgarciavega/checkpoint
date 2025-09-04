import React, { useState, useEffect } from 'react';
import logoImg from './assets/Api.png';
import qrIcon from './assets/qr.png'
import formIcon from './assets/foam.png';
import bitacoraIcon from './assets/bitacora.png';
import configIcon from './assets/config.png';
// Eliminar la referencia al ícono qr-generator.png
import './Navbar.css';

const Navbar = ({ active, onSelect, modoOscuro, onToggleModo, fechaHora }) => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Elementos para móvil (incluye scanner)
  const mobileItems = [
    { key: 'scanner', label: 'Escáner', icon: qrIcon },
    { key: 'form', label: 'Formulario', icon: formIcon },
    { key: 'config', label: 'Configuración', icon: configIcon },
    { key: 'modoOscuro', label: modoOscuro ? 'Modo Claro' : 'Modo Oscuro', icon: configIcon },
  ];

  // Elementos para escritorio (sin scanner, incluye bitácora)
  const desktopItems = [
    { key: 'form', label: 'Formulario', icon: formIcon },
    { key: 'bitacora', label: 'Bitácora', icon: bitacoraIcon },
    { key: 'config', label: 'Configuración', icon: configIcon },
    { key: 'generarQR', label: 'Generar QR', icon: qrIcon }, // Agregado Generar QR al menú de escritorio
  ]; // Eliminar el botón de modo oscuro/claro en escritorio y web

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
    if (key === 'modoOscuro') {
      onToggleModo(); // Cambiar el estado de modo oscuro/claro
    }
    onSelect(key);
    setMenuAbierto(false); // Cerrar menú móvil al seleccionar
  };

  const handleToggleModo = () => {
    onToggleModo(); // Cambiar el estado de modo oscuro/claro
    setMenuAbierto(false); // Cerrar el menú después de cambiar el modo
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
      </ul>

      {/* Botón modo oscuro/claro - solo en móvil */}
      {isMobile && (
        // Eliminar el botón de modo oscuro/claro fuera del menú
        null
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
