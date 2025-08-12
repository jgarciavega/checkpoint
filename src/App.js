// Estructura base de React (App.js)
import React, { useState, useEffect } from 'react';



import Header from './Header';
import AccessForm from './AccessForm';
import Bitacora from './Bitacora';
import QrScannerPanel from './QrScannerPanel';
import Configuracion from './Configuracion';
import LoginForm from './LoginForm';




function App() {
  const [showConfig, setShowConfig] = useState(false);
  const [usuario, setUsuario] = useState(null); // usuario logeado
  // Escuchar cambios en localStorage/configuración y en tiempo real desde Configuracion
  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem('configuracionApp');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    const applyConfig = (cfg) => {
      // Modo oscuro/claro
      if (cfg.modoOscuro === 'oscuro') {
        document.body.classList.add('dark');
        document.body.classList.remove('light');
      } else if (cfg.modoOscuro === 'claro') {
        document.body.classList.add('light');
        document.body.classList.remove('dark');
      } else {
        document.body.classList.remove('dark');
        document.body.classList.remove('light');
      }
      // Tamaño de texto
      document.body.style.fontSize =
        cfg.tamanoTexto === 'grande' ? '1.15em' :
        cfg.tamanoTexto === 'extra' ? '1.3em' : '1em';
    };
    applyConfig(config);
  }, [config]);

  // Escuchar cambios en localStorage desde otras pestañas
  useEffect(() => {
    const onStorage = () => {
      const saved = localStorage.getItem('configuracionApp');
      setConfig(saved ? JSON.parse(saved) : {});
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const handleConfigClick = () => setShowConfig(true);
  const handleCloseConfig = () => setShowConfig(false);


  if (!usuario) {
    return <LoginForm onLogin={setUsuario} />;
  }

  // Mostrar nombre del operador en sesión
  const nombreOperador = usuario && usuario.nombre ? usuario.nombre : '';

  return (
    <div>
      <Header onConfigClick={handleConfigClick} />
      {/* Botón de cerrar sesión flotante */}
      <button
        onClick={() => setUsuario(null)}
        style={{
          position: 'fixed',
          top: 24,
          right: 32,
          zIndex: 1200,
          padding: '8px 22px',
          borderRadius: 8,
          border: 'none',
          background: 'linear-gradient(90deg, #ff2e63 70%, #ff6b81 100%)',
          color: '#fff',
          fontWeight: 700,
          fontSize: '1.08rem',
          boxShadow: '0 4px 18px rgba(255,46,99,0.25), 0 0 0 0 #ff2e63',
          cursor: 'pointer',
          transition: 'box-shadow 0.25s, transform 0.18s',
          letterSpacing: 1,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.boxShadow = '0 6px 24px 0 #ff2e63, 0 0 0 4px #fff3';
          e.currentTarget.style.transform = 'scale(1.045)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.boxShadow = '0 4px 18px rgba(255,46,99,0.25), 0 0 0 0 #ff2e63';
          e.currentTarget.style.transform = 'scale(1)';
        }}
        title="Cerrar sesión"
      >
        Cerrar sesión
      </button>
      <div
        style={{
          width: '100%',
          textAlign: 'center',
          fontWeight: 800,
          fontSize: '2.4rem',
          margin: '12px 0 8px 0',
          letterSpacing: 2,
          color: 'var(--color-accent)',
          textShadow: '0 2px 12px rgba(0,0,0,0.25), 0 1px 0 #fff',
          textTransform: 'uppercase',
          background: 'none',
        }}
      >
        PUERTO PICHILINGUE
      </div>
      <div
        style={{
          width: '100%',
          textAlign: 'center',
          fontWeight: 500,
          fontSize: '1.25rem',
          margin: '0 0 18px 0',
          color: '#fff',
          textShadow: '0 1px 6px rgba(0,0,0,0.18)',
        }}
      >
        Operador en turno: <span style={{ color: 'var(--color-accent)', fontWeight: 700 }}>{nombreOperador}</span>
      </div>
      <main className="main-content">
        <QrScannerPanel />
        <AccessForm />
        <Bitacora />
      </main>
      {showConfig && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ position: 'relative' }}>
            <button onClick={handleCloseConfig} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', fontSize: 28, cursor: 'pointer', zIndex: 2, color: 'var(--color-accent)' }}>×</button>
            <Configuracion onConfigChange={setConfig} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
