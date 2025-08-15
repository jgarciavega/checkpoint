
import React, { useState, useRef, useEffect } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';


function QrScannerPanel({ onScan }) {
  const [active, setActive] = useState(false);
  const [result, setResult] = useState('');
  const videoRef = useRef(null);
  const codeReader = useRef(null);
  const controlsRef = useRef(null);
  const canvasRef = useRef(null);
  const captureRef = useRef(null);
  const isDecodingRef = useRef(false);
  const [cameraError, setCameraError] = useState('');
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [diagnosticsOpen, setDiagnosticsOpen] = useState(false);
  const [videoStats, setVideoStats] = useState({ width: 0, height: 0, fps: 0, capabilities: null });
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const devs = await BrowserMultiFormatReader.listVideoInputDevices();
        if (mounted) setDevices(devs);
      } catch (e) {
        // ignore
      }
    })();
    return () => { mounted = false; };
  }, []);

  // monitor simple de stats del video
  useEffect(() => {
    let raf = null;
    let lastTime = performance.now();
    let frames = 0;
    const tick = () => {
      try {
        if (videoRef.current && videoRef.current.videoWidth) {
          frames++;
          const now = performance.now();
          if (now - lastTime >= 1000) {
            const fps = Math.round((frames * 1000) / (now - lastTime));
            setVideoStats(s => ({ ...s, width: videoRef.current.videoWidth || 0, height: videoRef.current.videoHeight || 0, fps }));
            lastTime = now;
            frames = 0;
          }
        }
      } catch (e) {}
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { if (raf) cancelAnimationFrame(raf); };
  }, [active]);

  useEffect(() => {
    return () => {
      // cleanup on unmount
      try {
        if (controlsRef.current) controlsRef.current.stop();
      } catch (e) {}
      try {
        if (videoRef.current && videoRef.current.srcObject) {
          const tracks = videoRef.current.srcObject.getTracks();
          tracks.forEach(t => t.stop());
          videoRef.current.srcObject = null;
        }
        if (captureRef.current) { clearInterval(captureRef.current); captureRef.current = null; }
        if (canvasRef.current) { try { canvasRef.current.width = 0; canvasRef.current = null; } catch (e) {} }
      } catch (e) {}
    };
  }, []);

  const handleScan = async () => {
    if (!active) {
      setResult('');
      setCameraError('');
      setActive(true);
      codeReader.current = new BrowserMultiFormatReader();
      try {
  const videoInputDevices = await BrowserMultiFormatReader.listVideoInputDevices();
  // actualizar lista local para selector
  setDevices(videoInputDevices);
  const deviceToUse = selectedDeviceId || videoInputDevices[0]?.deviceId;
        if (deviceToUse) {
          // Limpiar stream anterior si existe
          if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
          }
          // Obtener el stream manualmente para asignarlo al <video>
          try {
            // preferir cámara trasera y resolución moderada para mejorar lectura en movimiento
            const constraints = {
              video: {
                deviceId: { exact: deviceToUse },
                width: { ideal: 1280 },
                height: { ideal: 720 },
                frameRate: { ideal: 20, max: 30 },
                facingMode: { ideal: 'environment' },
              }
            };
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }

            // intentar activar torch/flash si está disponible (típico en tablets/phones)
            try {
              const [track] = stream.getVideoTracks() || [];
              if (track && 'applyConstraints' in track) {
                const capabilities = track.getCapabilities && track.getCapabilities();
                if (capabilities && capabilities.torch) {
                  try { await track.applyConstraints({ advanced: [{ torch: false }] }); } catch (e) { /* ignore */ }
                }
              }
            } catch (e) {
              // no crítico
            }
          } catch (streamErr) {
            // fallback a pedir cualquier cámara disponible
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) videoRef.current.srcObject = stream;
          }
          // en lugar de usar decodeFromVideoDevice, haremos un loop de captura centrada (ROI)
          // y pasaremos esa porción al decoder para mejorar la lectura en movimiento.
          // setup canvas
          canvasRef.current = document.createElement('canvas');
          const startCaptureLoop = () => {
            // frecuencia de captura en ms
            const interval = 150; // ~6-7 fps, ajustable
            captureRef.current = setInterval(async () => {
              try {
                if (isDecodingRef.current) return;
                if (!videoRef.current) return;
                if (videoRef.current.readyState < 2) return; // no enough data
                const vw = videoRef.current.videoWidth;
                const vh = videoRef.current.videoHeight;
                if (!vw || !vh) return;
                const roiPct = 0.38; // coincide con .scanner-target
                const cropW = Math.floor(vw * roiPct);
                const cropH = cropW;
                const sx = Math.floor((vw - cropW) / 2);
                const sy = Math.floor((vh - cropH) / 2);
                const canvas = canvasRef.current;
                canvas.width = cropW;
                canvas.height = cropH;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(videoRef.current, sx, sy, cropW, cropH, 0, 0, cropW, cropH);
                // crear imagen desde canvas y decodificar
                const dataUrl = canvas.toDataURL('image/png');
                const img = new Image();
                img.onload = async () => {
                  try {
                    isDecodingRef.current = true;
                    const res = await codeReader.current.decodeFromImage(undefined, img);
                    if (res) {
                      const text = res.getText();
                      setResult(text);
                      if (typeof onScan === 'function') {
                        try { onScan(text); } catch (e) { /* ignore */ }
                      }
                      if (typeof window !== 'undefined') {
                        const ev = new CustomEvent('qr-scan', { detail: text });
                        window.dispatchEvent(ev);
                      }
                      // feedback
                      try {
                        const ctxA = new (window.AudioContext || window.webkitAudioContext)();
                        const o = ctxA.createOscillator();
                        const g = ctxA.createGain();
                        o.type = 'sine'; o.frequency.value = 880; g.gain.value = 0.05;
                        o.connect(g); g.connect(ctxA.destination); o.start();
                        setTimeout(() => { o.stop(); try { ctxA.close(); } catch (e){} }, 120);
                      } catch (e) {}
                      const wrap = videoRef.current && videoRef.current.parentElement;
                      if (wrap) {
                        wrap.classList.add('qr-detected');
                        setTimeout(() => wrap.classList.remove('qr-detected'), 800);
                      }
                      // stop capture and stream
                      if (captureRef.current) { clearInterval(captureRef.current); captureRef.current = null; }
                      setActive(false);
                      if (videoRef.current && videoRef.current.srcObject) {
                        const tracks = videoRef.current.srcObject.getTracks();
                        tracks.forEach(track => track.stop());
                        videoRef.current.srcObject = null;
                      }
                    }
                  } catch (e) {
                    // decodificación fallida, ignora
                  } finally {
                    isDecodingRef.current = false;
                  }
                };
                img.src = dataUrl;
              } catch (e) {
                // ignore per-frame errors
              }
            }, interval);
          };
          // esperar que el <video> tenga el stream y luego iniciar loop
          setTimeout(() => startCaptureLoop(), 200);
        } else {
          setCameraError('No se detectó cámara disponible.');
          setActive(false);
        }
      } catch (e) {
        setCameraError('No se pudo acceder a la cámara. ' + (e.message || ''));
        setActive(false);
      }
    } else {
      setActive(false);
      if (controlsRef.current) controlsRef.current.stop();
      // Detener el stream manualmente
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    }
  };

  // efecto para fallback con html5-qrcode
  useEffect(() => {
    let hqr = null;
    let mounted = true;
    const startHqr = async () => {
      if (!useFallback) return;
      try {
        const { Html5Qrcode } = await import('html5-qrcode');
        if (!mounted) return;
        const containerId = 'hqr-container';
        const html5QrCode = new Html5Qrcode(containerId);
        hqr = html5QrCode;
        const config = { fps: 10, qrbox: { width: 250, height: 250 } };
        await html5QrCode.start(
          { facingMode: 'environment' },
          config,
          (decoded) => {
            setResult(decoded);
            if (typeof onScan === 'function') { try { onScan(decoded); } catch (e) {} }
            const ev = new CustomEvent('qr-scan', { detail: decoded }); window.dispatchEvent(ev);
            // stop after success
            try { html5QrCode.stop(); } catch (e) {}
            setUseFallback(false);
            setActive(false);
          },
          (err) => { /* ignore per-frame errors */ }
        );
      } catch (e) {
        setCameraError('Fallback html5-qrcode no pudo iniciarse: ' + (e.message || ''));
      }
    };
    if (useFallback) startHqr();
    return () => {
      mounted = false;
      if (hqr) { try { hqr.stop(); } catch (e) {} }
    };
  }, [useFallback]);

  return (
  <section className="card" style={{ width: '100%', maxWidth: 1200, minWidth: 320, margin: '0 auto' }}>
      <h2 style={{ color: 'var(--color-primary)', marginBottom: 16, fontWeight: 700 }}>Escanear Código QR</h2>
      <div className={`qr-scanner${active ? ' active' : ''}`} style={{ marginBottom: 18, minHeight: 220, position: 'relative' }}>
        {/* control para abrir diagnostico y fallback */}
        <div style={{ position: 'absolute', left: 10, top: 10, zIndex: 4, display: 'flex', gap: 8 }}>
          <button className="btn" onClick={() => setDiagnosticsOpen(d => !d)} style={{ padding: '6px 10px' }}>Diagnóstico</button>
          <button className="btn" onClick={async () => { setUseFallback(u => !u); }} style={{ padding: '6px 10px' }}>{useFallback ? 'Fallback ON' : 'Usar Fallback'}</button>
        </div>
        {active ? (
          <>
            <video ref={videoRef} style={{ width: '100%', borderRadius: 12 }} autoPlay muted playsInline />
            {/* Overlay objetivo */}
            <div className="scanner-overlay" aria-hidden="true">
              <div className="scanner-target" />
            </div>
            <div className="scanner-instructions">Acerque y centre el QR en la diana — mantén la tablet estable</div>
            {/* linterna/torch control */}
            <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 3 }}>
              <button
                className="btn"
                onClick={async () => {
                  try {
                    const stream = videoRef.current && videoRef.current.srcObject;
                    if (!stream) return;
                    const [track] = stream.getVideoTracks();
                    if (!track) return;
                    const caps = track.getCapabilities && track.getCapabilities();
                    if (caps && caps.torch) {
                      const settings = track.getSettings && track.getSettings();
                      await track.applyConstraints({ advanced: [{ torch: !(settings && settings.torch) }] });
                    } else {
                      setCameraError('Linterna no soportada en este dispositivo.');
                    }
                  } catch (e) {
                    setCameraError('No fue posible cambiar la linterna: ' + (e.message || ''));
                  }
                }}
                style={{ padding: '6px 10px' }}
              >Linterna</button>
            </div>
          </>
        ) : (
          <span style={{ fontSize: 54, color: 'var(--color-muted)' }}>
            <svg width="64" height="64" fill="none" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="4" stroke="var(--color-primary)" strokeWidth="2"/><path d="M8 8h8v8H8z" stroke="var(--color-accent)" strokeWidth="2"/></svg>
          </span>
        )}
        {/* selector de dispositivo cuando no está activo */}
        {!active && devices && devices.length > 0 && (
          <div style={{ marginTop: 8 }}>
            <label style={{ fontSize: 12, color: 'var(--color-muted)', marginRight: 8 }}>Cámara:</label>
            <select value={selectedDeviceId} onChange={e => setSelectedDeviceId(e.target.value)} style={{ padding: '6px 8px' }}>
              {devices.map(d => (
                <option key={d.deviceId} value={d.deviceId}>{d.label || d.deviceId}</option>
              ))}
            </select>
          </div>
        )}
        <p style={{ color: 'var(--color-muted)', marginTop: 12, fontWeight: 500 }}>
          {active ? 'Escaneando...' : 'Presiona "Iniciar Escaneo" para activar la cámara'}
        </p>
        {cameraError && (
          <div style={{ color: 'var(--color-accent)', fontWeight: 600, marginTop: 8 }}>{cameraError}</div>
        )}
        {/* panel de diagnostico */}
        {diagnosticsOpen && (
          <div style={{ position: 'absolute', left: 10, top: 56, zIndex: 5, background: 'rgba(0,0,0,0.6)', color: '#fff', padding: 12, borderRadius: 8, fontSize: 12 }}>
            <div style={{ marginBottom: 6 }}><b>Dispositivos:</b></div>
            <div style={{ maxHeight: 140, overflow: 'auto' }}>{devices.map(d => <div key={d.deviceId} style={{ padding: '4px 0' }}>{d.label || d.deviceId}</div>)}</div>
            <div style={{ marginTop: 8 }}><b>Video:</b> {videoStats.width}x{videoStats.height} @{videoStats.fps}fps</div>
            <div style={{ marginTop: 6 }}><b>Capabilities:</b> {videoStats.capabilities ? JSON.stringify(videoStats.capabilities) : '–'}</div>
          </div>
        )}
        {result && (
          <div style={{ marginTop: 10, color: 'var(--color-success)', fontWeight: 600, wordBreak: 'break-all' }}>
            <span>QR detectado:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
              <div style={{ color: 'var(--color-accent)', fontSize: 16, wordBreak: 'break-all' }}>{result}</div>
              <button
                className="btn"
                onClick={() => {
                  try { navigator.clipboard.writeText(result); } catch (e) { /* ignore */ }
                }}
                style={{ padding: '6px 8px' }}
              >Copiar</button>
            </div>
          </div>
        )}
        {useFallback && (
          <div id="hqr-container" style={{ position: 'absolute', inset: '8px', zIndex: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
        )}
      </div>
      <button
        className={`btn${active ? ' btn-danger' : ''}`}
        type="button"
        onClick={handleScan}
        style={{ width: '100%', justifyContent: 'center' }}
      >
        {active ? 'Detener Escaneo' : 'Iniciar Escaneo'}
      </button>
    </section>
  );
}

export default QrScannerPanel;
