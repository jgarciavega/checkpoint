

import React, { useState, useEffect } from 'react';
import logoLight from './assets/port.png';
import logoDark from './assets/dark2.png';

function Header({ modoOscuro }) {
  const [screenSize, setScreenSize] = useState('desktop');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 480) {
        setScreenSize('mobile');
      } else if (width < 768) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };

    handleResize(); // Verificar tamaño inicial
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getResponsiveStyles = () => {
    switch (screenSize) {
      case 'mobile':
        return {
          container: {
            minHeight: 60,
            padding: '8px 12px',
            flexDirection: 'column',
            gap: 8
          },
          logo: {
            width: 120,
            height: 75
          },
          title: {
            fontSize: '1.2rem',
            letterSpacing: 0.5,
            lineHeight: 1.2
          }
        };
      case 'tablet':
        return {
          container: {
            minHeight: 70,
            padding: '10px 16px',
            flexDirection: 'row'
          },
          logo: {
            width: 120,
            height: 75
          },
          title: {
            fontSize: '1.5rem',
            letterSpacing: 0.8
          }
        };
      default: // desktop
        return {
          container: {
            minHeight: 80,
            padding: '12px 24px'
          },
          logo: {
            width: 140,
            height: 90
          },
          title: {
            fontSize: '2rem',
            letterSpacing: 1
          }
        };
    }
  };

  const styles = getResponsiveStyles();

  return (
    <header 
      className="header" 
      style={{ 
        display: 'flex', 
        flexDirection: styles.container.flexDirection || 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: styles.container.minHeight,
        padding: styles.container.padding,
        gap: styles.container.gap || 0,
        width: '100%',
        maxWidth: '100vw',
        overflow: 'hidden'
      }}
    >
      <div 
        style={{ 
          width: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          position: 'relative', 
          minHeight: styles.container.minHeight,
          flexDirection: screenSize === 'mobile' ? 'column' : 'row',
          gap: screenSize === 'mobile' ? 8 : 16
        }}
      >
        {/* Logo izquierdo */}
        <img
          src={modoOscuro ? logoDark : logoLight}
          alt="Logo API Izquierdo"
          style={{
            width: styles.logo.width,
            height: styles.logo.height,
            objectFit: 'contain',
            background: 'none',
            borderRadius: 0,
            boxShadow: 'none',
            zIndex: 5,
            mixBlendMode: 'normal',
            filter: 'none',
            transition: 'all 0.3s ease',
            order: screenSize === 'mobile' ? 1 : 0
          }}
        />
        
        {/* Título central */}
        <span 
          className="header-title" 
          style={{ 
            fontWeight: 700, 
            fontSize: styles.title.fontSize,
            letterSpacing: styles.title.letterSpacing,
            textAlign: 'center',
            flex: 1,
            textTransform: 'uppercase',
            lineHeight: styles.title.lineHeight || 1,
            transition: 'all 0.3s ease',
            color: modoOscuro ? '#e6eef8' : '#0f172a',
            textShadow: modoOscuro 
              ? '0 2px 8px rgba(0,0,0,0.3)' 
              : '0 1px 4px rgba(0,0,0,0.1)',
            wordBreak: screenSize === 'mobile' ? 'break-word' : 'normal',
            hyphens: screenSize === 'mobile' ? 'auto' : 'none',
            order: screenSize === 'mobile' ? 2 : 1
          }}
        >
          CONTROL DE ACCESO
        </span>
        
        {/* Logo derecho */}
        <img
          src={modoOscuro ? logoDark : logoLight}
          alt="Logo API Derecho"
          style={{
            width: styles.logo.width,
            height: styles.logo.height,
            objectFit: 'contain',
            background: 'none',
            borderRadius: 0,
            boxShadow: 'none',
            zIndex: 5,
            mixBlendMode: 'normal',
            filter: 'none',
            transition: 'all 0.3s ease',
            order: screenSize === 'mobile' ? 3 : 2,
            display: screenSize === 'mobile' ? 'none' : 'block' // Ocultar segundo logo en móvil
          }}
        />
      </div>
      
      {/* CSS responsive adicional */}
      <style>{`
        @media (max-width: 479px) {
          .header-title {
            max-width: 90vw;
            word-wrap: break-word;
          }
        }
        
        @media (max-width: 360px) {
          .header-title {
            font-size: 1rem !important;
            letter-spacing: 0.3px !important;
          }
          
          .header img {
            width: 100px !important;
            height: 60px !important;
          }
        }
        
        @media (orientation: landscape) and (max-height: 500px) {
          .header {
            min-height: 50px !important;
            padding: 5px 12px !important;
          }
          
          .header img {
            width: 100px !important;
            height: 60px !important;
          }
          
          .header-title {
            font-size: 1.2rem !important;
          }
        }
      `}</style>
    </header>
  );
}

export default Header;
