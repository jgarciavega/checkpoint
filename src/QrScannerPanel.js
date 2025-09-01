import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

// Solo html5-qrcode, robusto para móvil/tableta
function QrScannerPanel({ onScan }) {
  const containerRef = useRef(null);
  const readerRef = useRef(null);
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  // Eliminado: fileInputRef y lógica de imagen

  // Función para calcular dimensiones responsive mejorada
  const getResponsiveDimensions = () => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const isLandscape = viewportWidth > viewportHeight;
    
    // Para móviles muy pequeños (< 360px)
    if (viewportWidth < 360) {
      const size = Math.min(viewportWidth - 32, 250);
      return {
        containerSize: size,
        qrboxSize: Math.floor(size * 0.8),
        fontSize: '1.2rem',
        titleMargin: 10,
        padding: '0 12px',
        instructionsSize: '0.8rem'
      };
    }
    
    // Para móviles pequeños (360px - 400px)
    if (viewportWidth < 400) {
      const size = Math.min(viewportWidth - 40, 280);
      return {
        containerSize: size,
        qrboxSize: Math.floor(size * 0.82),
        fontSize: '1.3rem',
        titleMargin: 12,
        padding: '0 16px',
        instructionsSize: '0.85rem'
      };
    }
    
    // Para móviles medianos (400px - 600px)
    if (viewportWidth < 600) {
      const size = Math.min(viewportWidth - 60, 320);
      return {
        containerSize: size,
        qrboxSize: Math.floor(size * 0.85),
        fontSize: '1.5rem',
        titleMargin: 14,
        padding: '0 20px',
        instructionsSize: '0.9rem'
      };
    }
    
    // Para landscape en móviles (altura pequeña)
    if (isLandscape && viewportHeight < 500) {
      const size = Math.min(viewportHeight - 120, 280);
      return {
        containerSize: size,
        qrboxSize: Math.floor(size * 0.85),
        fontSize: '1.4rem',
        titleMargin: 8,
        padding: '0 20px',
        instructionsSize: '0.8rem'
      };
    }
    
    // Para tablets y desktop
    return {
      containerSize: 320,
      qrboxSize: 280,
      fontSize: '1.8rem',
      titleMargin: 16,
      padding: '0 24px',
      instructionsSize: '0.9rem'
    };
  };

  const [dimensions, setDimensions] = useState(getResponsiveDimensions);

  // Actualizar dimensiones cuando cambie el tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      setDimensions(getResponsiveDimensions());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Iniciar escaneo al montar
  useEffect(() => {
    let stopped = false;
    const startQr = async () => {
      setError('');
      setIsScanning(true);
      
      console.log('Iniciando escáner QR...');
      console.log('HTTPS disponible:', window.location.protocol === 'https:');
      console.log('Navigator.mediaDevices disponible:', !!navigator.mediaDevices);
      console.log('getUserMedia disponible:', !!navigator.mediaDevices?.getUserMedia);
      
      try {
        if (!containerRef.current) {
          console.error('containerRef.current es null');
          return;
        }
        
        console.log('Creando instancia Html5Qrcode...');
        const html5QrCode = new Html5Qrcode(containerRef.current.id, { verbose: true });
        readerRef.current = html5QrCode;
        
        console.log('Configurando parámetros del escáner...');
        const config = { 
          fps: 15, 
          qrbox: { width: dimensions.qrboxSize, height: dimensions.qrboxSize }, 
          disableFlip: false,
          aspectRatio: 1.0 // Mantener aspecto cuadrado
        };
        
        console.log('Intentando iniciar cámara...');
        await html5QrCode.start(
          { facingMode: "environment" },
          config,
          (decodedText) => {
            if (stopped) return;
            setIsScanning(false);
            setIsOpen(false);
            (async () => { try { await html5QrCode.stop(); } catch (e) {} try { await html5QrCode.clear(); } catch (e) {} readerRef.current = null; })();
            if (/^https?:\/\//i.test(decodedText)) {
              window.location.href = decodedText;
              return;
            }
            if (typeof onScan === 'function') onScan(decodedText);
          },
          (err) => {}
        );
      } catch (e) {
        console.error('Error completo del escáner QR:', e);
        console.error('Tipo de error:', typeof e);
        console.error('Propiedades del error:', Object.keys(e));
        console.error('Stack trace:', e.stack);
        
        let errorMessage = 'Error desconocido';
        
        // Verificar diferentes tipos de errores
        if (e.name === 'NotAllowedError') {
          errorMessage = 'Permisos de cámara denegados. Ve a Configuración del navegador > Privacidad > Cámara y permite el acceso para este sitio.';
        } else if (e.name === 'NotFoundError') {
          errorMessage = 'No se encontró ninguna cámara en el dispositivo.';
        } else if (e.name === 'NotSupportedError') {
          errorMessage = 'El navegador no soporta acceso a cámara. Usa Chrome, Firefox o Edge.';
        } else if (e.name === 'NotReadableError') {
          errorMessage = 'La cámara está siendo usada por otra aplicación.';
        } else if (e.message && e.message.includes('Permission denied')) {
          errorMessage = 'Permisos denegados. Habilita el acceso a la cámara en el navegador.';
        } else if (e.message && e.message.includes('HTTPS')) {
          errorMessage = 'Se requiere HTTPS para acceder a la cámara.';
        } else if (e.message && e.message.includes('getUserMedia')) {
          errorMessage = 'Error al acceder a getUserMedia. Verifica permisos de cámara.';
        } else if (e.toString && e.toString().includes('Unable to start scanning')) {
          errorMessage = 'No se pudo iniciar el escaneo. Verifica que la cámara esté disponible.';
        }
        
        // Crear mensaje detallado para depuración
        const debugInfo = [
          `Nombre: ${e.name || 'undefined'}`,
          `Mensaje: ${e.message || 'undefined'}`,
          `Código: ${e.code || 'undefined'}`,
          `toString: ${e.toString ? e.toString() : 'undefined'}`
        ].join(' | ');
        
        setError(`${errorMessage}\n\nDetalles técnicos: ${debugInfo}`);
        setIsScanning(false);
      }
    };
    startQr();
    return () => {
      stopped = true;
      setIsScanning(false);
      if (readerRef.current) {
        const safeStop = async () => {
          try { await readerRef.current.stop(); } catch (e) {
            if (!String(e).includes('Cannot stop, scanner is not running or paused.')) console.error(e);
          }
          try { await readerRef.current.clear(); } catch (e) {}
          readerRef.current = null;
        };
        safeStop();
      }
    };
  }, [dimensions]); // Incluir dimensions como dependencia para reiniciar cuando cambien



  if (!isOpen) return null;

  const isLandscape = window.innerWidth > window.innerHeight;
  const isMobile = window.innerWidth < 600;

  return (
    <section 
      className="qr-scanner-section"
      style={{ 
        width: '100%', 
        maxWidth: '100vw',
        margin: '0 auto', 
        padding: dimensions.padding,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: isLandscape && window.innerHeight < 500 ? 'auto' : '100vh',
        justifyContent: isLandscape && window.innerHeight < 500 ? 'flex-start' : 'center',
        paddingTop: isLandscape && window.innerHeight < 500 ? '10px' : '20px',
        paddingBottom: '20px',
        boxSizing: 'border-box'
      }}
    >
      <h2 
        style={{ 
          color: 'var(--color-primary)', 
          marginBottom: dimensions.titleMargin, 
          fontWeight: 700,
          fontSize: dimensions.fontSize,
          textAlign: 'center',
          width: '100%',
          maxWidth: '95vw',
          lineHeight: 1.2,
          wordBreak: isMobile ? 'break-word' : 'normal',
          hyphens: isMobile ? 'auto' : 'none'
        }}
      >
        {isMobile ? 'Escanear QR' : 'Escanear Código QR'}
      </h2>
      
      <div 
        className="qr-scanner-container"
        style={{ 
          position: 'relative', 
          width: dimensions.containerSize, 
          height: dimensions.containerSize, 
          margin: '0 auto', 
          background: '#000', 
          borderRadius: 16,
          maxWidth: '90vw',
          maxHeight: isLandscape && window.innerHeight < 500 ? '40vh' : '60vh',
          aspectRatio: '1/1',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          border: '2px solid rgba(255,255,255,0.1)'
        }}
      >
        <div 
          id="qr-reader-html5" 
          ref={containerRef} 
          style={{ 
            width: '100%', 
            height: '100%', 
            borderRadius: 14, 
            overflow: 'hidden' 
          }} 
        />
        
        {/* Overlay animado mejorado */}
        <div 
          className="qr-overlay"
          style={{ 
            pointerEvents: 'none', 
            position: 'absolute', 
            left: '8%', 
            top: '8%', 
            width: '84%', 
            height: '84%', 
            border: '3px solid #fff', 
            borderRadius: 12,
            boxShadow: '0 0 20px rgba(255,255,255,0.3)'
          }}
        >
          <div 
            className="scan-line"
            style={{ 
              position: 'absolute', 
              left: 0, 
              width: '100%', 
              height: 3, 
              background: 'linear-gradient(90deg, transparent, #0ff, #09f, #0ff, transparent)', 
              borderRadius: 2, 
              animation: 'scanline 2s linear infinite alternate',
              boxShadow: '0 0 10px #0ff'
            }} 
          />
          
          {/* Esquinas del marco */}
          <div style={{ position: 'absolute', top: -8, left: -8, width: 24, height: 24, border: '4px solid #0ff', borderRight: 'none', borderBottom: 'none', borderRadius: '8px 0 0 0' }} />
          <div style={{ position: 'absolute', top: -8, right: -8, width: 24, height: 24, border: '4px solid #0ff', borderLeft: 'none', borderBottom: 'none', borderRadius: '0 8px 0 0' }} />
          <div style={{ position: 'absolute', bottom: -8, left: -8, width: 24, height: 24, border: '4px solid #0ff', borderRight: 'none', borderTop: 'none', borderRadius: '0 0 0 8px' }} />
          <div style={{ position: 'absolute', bottom: -8, right: -8, width: 24, height: 24, border: '4px solid #0ff', borderLeft: 'none', borderTop: 'none', borderRadius: '0 0 8px 0' }} />
        </div>
      </div>
      
      {error && (
        <div 
          className="error-message"
          style={{ 
            color: '#ff4757', 
            background: 'rgba(255,255,255,0.95)', 
            padding: isMobile ? '10px 14px' : '12px 16px', 
            borderRadius: 8, 
            marginTop: 16,
            maxWidth: '90vw',
            fontSize: isMobile ? '0.8rem' : '0.9rem',
            lineHeight: 1.4,
            textAlign: 'center',
            wordBreak: 'break-word',
            border: '2px solid #ff4757',
            boxShadow: '0 4px 12px rgba(255,71,87,0.2)'
          }}
        >
          {error}
        </div>
      )}
      
      {isScanning && (
        <div 
          className="scanning-indicator"
          style={{ 
            color: '#00d2ff', 
            marginTop: 12, 
            fontWeight: 600,
            fontSize: isMobile ? '1rem' : '1.1rem',
            textAlign: 'center',
            animation: 'pulse 1.5s ease-in-out infinite alternate',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}
        >
          <span style={{ fontSize: '1.2em' }}>📷</span>
          Escaneando...
        </div>
      )}
      
      {/* Instrucciones mejoradas */}
      {!error && (
        <div 
          className="instructions"
          style={{
            marginTop: isLandscape && window.innerHeight < 500 ? 12 : 20,
            padding: isMobile ? '12px 16px' : '16px 20px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: 12,
            maxWidth: '90vw',
            textAlign: 'center',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}
        >
          <div style={{ 
            color: 'var(--color-text)', 
            fontSize: dimensions.instructionsSize,
            lineHeight: 1.5,
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: isMobile ? 8 : 16,
            flexWrap: 'wrap'
          }}>
            <span>📱 Centra el QR en el marco</span>
            <span>💡 Buena iluminación</span>
            <span>✋ Mantén estable</span>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes scanline { 
          0% { top: 0; opacity: 0.8; } 
          50% { opacity: 1; }
          100% { top: calc(100% - 3px); opacity: 0.8; } 
        }
        
        @keyframes pulse {
          0% { opacity: 0.7; transform: scale(1); }
          100% { opacity: 1; transform: scale(1.05); }
        }
        
        .qr-scanner-container {
          transition: all 0.3s ease;
        }
        
        .qr-scanner-container:hover {
          transform: scale(1.02);
          box-shadow: 0 12px 40px rgba(0,0,0,0.4);
        }
        
        @media (max-width: 360px) {
          .instructions {
            padding: 10px 12px !important;
          }
          
          .instructions div {
            font-size: 0.75rem !important;
            gap: 6px !important;
          }
        }
        
        @media (orientation: landscape) and (max-height: 500px) {
          .qr-scanner-section {
            justify-content: flex-start !important;
            padding-top: 5px !important;
          }
          
          .instructions {
            margin-top: 8px !important;
            padding: 8px 12px !important;
          }
        }
        
        @media (prefers-reduced-motion: reduce) {
          .scan-line {
            animation: none !important;
          }
          
          .scanning-indicator {
            animation: none !important;
          }
          
          .qr-scanner-container:hover {
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}

export default QrScannerPanel;
