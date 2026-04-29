import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Footer from '../../components/Footer';

export default function Login() {
  const [tab, setTab] = useState('login'); // 'login' | 'registro'
  const navigate = useNavigate();
  const { login, registrar } = useAuth();

  // ── Estado formulario Login ──
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');

  // ── Estado formulario Registro ──
  const [regForm, setRegForm] = useState({ nombre: '', email: '', password: '', confirmar: '' });
  const [regError, setRegError] = useState('');
  const [regExito, setRegExito] = useState('');

  function handleLogin(e) {
    e.preventDefault();
    setLoginError('');
    const resultado = login(loginForm.email, loginForm.password);
    if (resultado.ok) {
      navigate('/');
    } else {
      setLoginError(resultado.msg);
    }
  }

  function handleRegistro(e) {
    e.preventDefault();
    setRegError('');
    setRegExito('');

    if (regForm.nombre.trim().length < 3) return setRegError('Ingresa tu nombre completo');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regForm.email)) return setRegError('Correo no válido');
    if (regForm.password.length < 6) return setRegError('La contraseña debe tener al menos 6 caracteres');
    if (regForm.password !== regForm.confirmar) return setRegError('Las contraseñas no coinciden');

    const resultado = registrar(regForm.nombre, regForm.email, regForm.password);
    if (resultado.ok) {
      navigate('/');
    } else {
      setRegError(resultado.msg);
    }
  }

  return (
    <>
      <main style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div className="login-card" style={{ width: '100%', maxWidth: '420px' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <img src="/img/Sorprendeme.png" alt="Sorpréndeme" style={{ height: '60px' }} />
          </div>

          {/* Tabs */}
          <div className="login-tabs">
            <button
              className={`tab-btn ${tab === 'login' ? 'activo' : ''}`}
              onClick={() => { setTab('login'); setLoginError(''); }}
            >
              Iniciar sesión
            </button>
            <button
              className={`tab-btn ${tab === 'registro' ? 'activo' : ''}`}
              onClick={() => { setTab('registro'); setRegError(''); setRegExito(''); }}
            >
              Registrarse
            </button>
          </div>

          {/* ── FORMULARIO LOGIN ── */}
          {tab === 'login' && (
            <form onSubmit={handleLogin}>
              <div className="form-grupo">
                <label>Correo electrónico</label>
                <input
                  type="email"
                  placeholder="tu@correo.com"
                  value={loginForm.email}
                  onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))}
                  required
                />
              </div>
              <div className="form-grupo">
                <label>Contraseña</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={loginForm.password}
                  onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
                  required
                />
              </div>
              {loginError && <span className="error-msg" style={{ display: 'block', marginBottom: '1rem' }}>{loginError}</span>}
              <button type="submit" className="btn-primary btn-block">Ingresar</button>
              <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem', color: '#888' }}>
                ¿No tienes cuenta?{' '}
                <button type="button" className="link-btn" onClick={() => setTab('registro')}>Regístrate</button>
              </p>
            </form>
          )}

          {/* ── FORMULARIO REGISTRO ── */}
          {tab === 'registro' && (
            <form onSubmit={handleRegistro}>
              <div className="form-grupo">
                <label>Nombre completo</label>
                <input
                  type="text"
                  placeholder="Ej: María Gómez"
                  value={regForm.nombre}
                  onChange={e => setRegForm(f => ({ ...f, nombre: e.target.value }))}
                  required
                />
              </div>
              <div className="form-grupo">
                <label>Correo electrónico</label>
                <input
                  type="email"
                  placeholder="tu@correo.com"
                  value={regForm.email}
                  onChange={e => setRegForm(f => ({ ...f, email: e.target.value }))}
                  required
                />
              </div>
              <div className="form-grupo">
                <label>Contraseña</label>
                <input
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={regForm.password}
                  onChange={e => setRegForm(f => ({ ...f, password: e.target.value }))}
                  required
                />
              </div>
              <div className="form-grupo">
                <label>Confirmar contraseña</label>
                <input
                  type="password"
                  placeholder="Repite la contraseña"
                  value={regForm.confirmar}
                  onChange={e => setRegForm(f => ({ ...f, confirmar: e.target.value }))}
                  required
                />
              </div>
              {regError && <span className="error-msg" style={{ display: 'block', marginBottom: '1rem' }}>{regError}</span>}
              {regExito && <span style={{ color: 'green', display: 'block', marginBottom: '1rem' }}>{regExito}</span>}
              <button type="submit" className="btn-primary btn-block">Crear cuenta</button>
              <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem', color: '#888' }}>
                ¿Ya tienes cuenta?{' '}
                <button type="button" className="link-btn" onClick={() => setTab('login')}>Inicia sesión</button>
              </p>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
