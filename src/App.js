// Estructura base de React (App.js)
import React, { useState, useEffect } from 'react';


import Header from './Header';
import AccessForm from './AccessForm';
import Bitacora from './Bitacora';
import QrScannerPanel from './QrScannerPanel';
import Configuracion from './Configuracion';



function App() {
  const [showConfig, setShowConfig] = useState(false);
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

  return (
    <div>
      <Header onConfigClick={handleConfigClick} />
      <div
        style={{
          width: '100%',
          textAlign: 'center',
          fontWeight: 800,
          fontSize: '2.4rem',
          margin: '12px 0 28px 0',
          letterSpacing: 2,
          color: 'var(--color-accent)',
          textShadow: '0 2px 12px rgba(0,0,0,0.25), 0 1px 0 #fff',
          textTransform: 'uppercase',
          background: 'none',
        }}
      >
        PUERTO PICHILINGUE
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
