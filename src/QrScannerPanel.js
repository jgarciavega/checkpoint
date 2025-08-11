
import React, { useState, useRef } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';


function QrScannerPanel() {
  const [active, setActive] = useState(false);
  const [result, setResult] = useState('');
  const videoRef = useRef(null);
  const codeReader = useRef(null);
  const controlsRef = useRef(null);
  const [cameraError, setCameraError] = useState('');

  const handleScan = async () => {
    if (!active) {
      setResult('');
      setCameraError('');
      setActive(true);
      codeReader.current = new BrowserMultiFormatReader();
      try {
        const videoInputDevices = await BrowserMultiFormatReader.listVideoInputDevices();
        const selectedDeviceId = videoInputDevices[0]?.deviceId;
        if (selectedDeviceId) {
          // Limpiar stream anterior si existe
          if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
          }
          // Obtener el stream manualmente para asignarlo al <video>
          const stream = await navigator.mediaDevices.getUserMedia({ video: { deviceId: selectedDeviceId } });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            // No llamar a play() manualmente, ZXing lo maneja
          }
          controlsRef.current = await codeReader.current.decodeFromVideoDevice(
            selectedDeviceId,
            videoRef.current,
            (result, err) => {
              if (result) {
                setResult(result.getText());
                setActive(false);
                if (controlsRef.current) controlsRef.current.stop();
                // Detener el stream manualmente
                if (videoRef.current && videoRef.current.srcObject) {
                  const tracks = videoRef.current.srcObject.getTracks();
                  tracks.forEach(track => track.stop());
                  videoRef.current.srcObject = null;
                }
              }
              if (err && err.name === 'NotAllowedError') {
                setCameraError('Permiso de cámara denegado.');
                setActive(false);
              }
            }
          );
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

  return (
    <section className="card" style={{ maxWidth: 420 }}>
      <h2 style={{ color: 'var(--color-primary)', marginBottom: 16, fontWeight: 700 }}>Escanear Código QR</h2>
      <div className={`qr-scanner${active ? ' active' : ''}`} style={{ marginBottom: 18, minHeight: 220, position: 'relative' }}>
        {active ? (
          <video ref={videoRef} style={{ width: '100%', borderRadius: 12 }} autoPlay muted playsInline />
        ) : (
          <span style={{ fontSize: 54, color: 'var(--color-muted)' }}>
            <svg width="64" height="64" fill="none" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="4" stroke="var(--color-primary)" strokeWidth="2"/><path d="M8 8h8v8H8z" stroke="var(--color-accent)" strokeWidth="2"/></svg>
          </span>
        )}
        <p style={{ color: 'var(--color-muted)', marginTop: 12, fontWeight: 500 }}>
          {active ? 'Escaneando...' : 'Presiona "Iniciar Escaneo" para activar la cámara'}
        </p>
        {cameraError && (
          <div style={{ color: 'var(--color-accent)', fontWeight: 600, marginTop: 8 }}>{cameraError}</div>
        )}
        {result && (
          <div style={{ marginTop: 10, color: 'var(--color-success)', fontWeight: 600, wordBreak: 'break-all' }}>
            <span>QR detectado:</span>
            <div style={{ color: 'var(--color-accent)', fontSize: 16 }}>{result}</div>
          </div>
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
