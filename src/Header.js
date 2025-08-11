

import React, { useEffect, useState } from 'react';
import logoLight from './assets/Api.png';
import logoDark from './assets/api-dark23.png';



function Header({ onConfigClick }) {
  const [dateTime, setDateTime] = useState(new Date());
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.body.classList.contains('dark'));
    };
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 80 }}>
      <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', minHeight: 80 }}>
        {/* Logo a la izquierda */}
        <img
          src={logoLight}
          alt="Logo API"
          style={{
            width: isDark ? 130 : 100,
            height: isDark ? 130 : 100,
            objectFit: 'contain',
            background: 'none',
            borderRadius: 0,
            boxShadow: 'none',
            position: 'absolute',
            left:  isDark ? 0 : 12
          }}
        />
        <span className="header-title" style={{ fontWeight: 700, fontSize: '2rem', letterSpacing: 1, textAlign: 'center', width: '100%' }}>
          Control de Acceso
        </span>
        <div className="header-clock" style={{ position: 'absolute', right: 24, top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>
            {dateTime.toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'medium' })}
          </span>
          <button className="btn btn-danger" onClick={onConfigClick} title="Configuración" style={{ padding: 10, fontSize: 22 }}>
            <span role="img" aria-label="config">⚙️</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
