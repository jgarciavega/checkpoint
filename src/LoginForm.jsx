
import React, { useState } from 'react';
import './LoginForm.css';
// import apiLogo from './assets/Api.png';
import agentIcon from './assets/agent.png';
import agent2Icon from './assets/agent.png';

const USUARIOS_PRUEBA = [
  { usuario: 'admin', password: '1234', nombre: 'Jorge Garcia' },
  { usuario: 'operador1', password: '5678', nombre: 'Armando Arce' },
  { usuario: 'operador2', password: '1234', nombre: 'Pablo Winkler' },
  { usuario: 'supervisor', password: '1234', nombre: 'Luz Maria' },
];

export default function LoginForm({ onLogin }) {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [intentos, setIntentos] = useState(0);
  const [bloqueado, setBloqueado] = useState(false);
  const [tiempoRestante, setTiempoRestante] = useState(0);
  const bloqueoMin = 2; // minutos

  React.useEffect(() => {
    let timer;
    if (bloqueado && tiempoRestante > 0) {
      timer = setInterval(() => {
        setTiempoRestante(prev => {
          if (prev <= 1) {
            setBloqueado(false);
            setIntentos(0);
            setUsuario('');
            setPassword('');
            setError('');
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [bloqueado, tiempoRestante]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (bloqueado) return;
    const user = USUARIOS_PRUEBA.find(u => u.usuario === usuario && u.password === password);
    if (user) {
      setError('');
      setShake(false);
      setIntentos(0);
      onLogin(user);
    } else {
      const nuevoIntento = intentos + 1;
      setIntentos(nuevoIntento);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      if (nuevoIntento === 3) {
        setError('Comunícate o contacta con el administrador.');
        window.alert('Comunícate o contacta con el administrador.');
      } else if (nuevoIntento >= 5) {
        setError(`Demasiados intentos. Bloqueado por ${bloqueoMin} minutos.`);
        window.alert(`Demasiados intentos. El acceso se bloqueará por ${bloqueoMin} minutos.`);
        setBloqueado(true);
        setTiempoRestante(bloqueoMin * 60);
      } else {
        setError('Usuario o contraseña incorrectos');
      }
    }
  };

  const mostrarTiempo = () => {
    const min = Math.floor(tiempoRestante / 60);
    const seg = tiempoRestante % 60;
    return `${min}:${seg.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className="login-form-container"
      style={{
        background: 'linear-gradient(135deg, #1a2236 60%, #2d3250 100%)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Icono agent2 centrado arriba del formulario */}
  <img src={agent2Icon} alt="Agente " style={{ width: 116, height: 116, borderRadius: '50%', boxShadow: '0 8px 32px #0002', background: '#fff', objectFit: 'cover', border: '3px solid #1a2236', marginBottom: 24, marginTop: '-36px' }} />
      <form className={`login-form${shake ? ' shake' : ''}`} onSubmit={handleSubmit}>
        <h2>Iniciar Sesión</h2>
        <input
          type="text"
          placeholder="Usuario"
          value={usuario}
          onChange={e => setUsuario(e.target.value)}
          autoFocus
          disabled={bloqueado}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          disabled={bloqueado}
        />
        {error && <div className="login-error">{error}{bloqueado && tiempoRestante > 0 && <span> ({mostrarTiempo()})</span>}</div>}
        <button type="submit" disabled={bloqueado}>Entrar</button>
      </form>
    </div>
  );
}
