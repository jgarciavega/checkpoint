// src/QrScanner.js
import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

const QrScanner = ({ onScan }) => {
  const [error, setError] = useState(null);
  const [scanning, setScanning] = useState(false);
  const qrRef = useRef();

  useEffect(() => {
    let html5Qr;
    if (scanning) {
      html5Qr = new Html5Qrcode(qrRef.current.id);
      html5Qr.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        (decodedText) => {
          setScanning(false);
          html5Qr.stop();
          onScan(decodedText);
        },
        (err) => {}
      ).catch((err) => {
        setError("No se pudo acceder a la cámara");
        setScanning(false);
      });
    }
    return () => {
      if (html5Qr && html5Qr.getState() === 2) {
        html5Qr.stop();
      }
    };
  }, [scanning, onScan]);

  return (
    <div style={{ textAlign: "center" }}>
      {!scanning && (
        <button onClick={() => setScanning(true)} style={{ fontSize: 18, padding: 12 }}>
          Escanear QR
        </button>
      )}
      {scanning && (
        <div>
          <div id="qr-reader" ref={qrRef} style={{ width: 280, margin: "0 auto" }} />
          <p>Apunta la cámara al código QR</p>
        </div>
      )}
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
};

export default QrScanner;