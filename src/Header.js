

import React from 'react';
import logoLight from './assets/port.png';
import logoDark from './assets/dark2.png';

function Header({ modoOscuro }) {
  return (
    <header className="header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 80 }}>
      <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', minHeight: 80 }}>
        {/* Logo a la izquierda */}
        <img
          src={modoOscuro ? logoDark : logoLight}
          alt="Logo API"
          style={{
            width: 180,
            height: 115,
            objectFit: 'contain',
            background: 'none',
            borderRadius: 0,
            boxShadow: 'none',
            position: 'absolute',
            left: 12,
            zIndex: 5,
            mixBlendMode: 'normal',
            filter: 'none',
          }}
        />
        <span className="header-title" style={{ fontWeight: 700, fontSize: '2rem', letterSpacing: 1, textAlign: 'center', width: '100%', textTransform: 'uppercase' }}>
          CONTROL DE ACCESO
        </span>
      </div>
    </header>
  );
}

export default Header;
