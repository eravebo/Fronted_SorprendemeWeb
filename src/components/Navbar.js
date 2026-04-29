import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { totalItems } = useCarrito();
  const { usuarioActual, logout } = useAuth();

  function cerrarMenu() { setMenuAbierto(false); }

  return (
    <header>
      <nav className="navbar">
        <button
          className={`menuresponsive ${menuAbierto ? 'abierto' : ''}`}
          onClick={() => setMenuAbierto(v => !v)}
          aria-label="Menú"
        >
          <span /><span /><span />
        </button>

        <div className="nav-container">
          <div className="nav-logo-img">
            <Link to="/" onClick={cerrarMenu}>
              <img src="/img/Sorprendeme.png" alt="Sorpréndeme" />
            </Link>
          </div>

          <ul className={`nav-links ${menuAbierto ? 'abierto' : ''}`}>
            <li><NavLink to="/" end onClick={cerrarMenu}>Inicio</NavLink></li>
            <li><a href="/#productos" onClick={cerrarMenu}>Productos</a></li>
            <li><NavLink to="/mis-pedidos" onClick={cerrarMenu}>Mis pedidos</NavLink></li>
            <li><a href="/#footer" onClick={cerrarMenu}>Contacto</a></li>

            {usuarioActual ? (
              <>
                <li className="nav-usuario">Hola, {usuarioActual.nombre.split(' ')[0]} 👋</li>
                <li>
                  <button className="btn-logout-nav" onClick={() => { logout(); cerrarMenu(); }}>
                    Salir
                  </button>
                </li>
              </>
            ) : (
              <li><NavLink to="/login" onClick={cerrarMenu}>Ingresar</NavLink></li>
            )}
          </ul>

          <div className="nav-carrito">
            <Link to="/carrito" onClick={cerrarMenu}>
              Mi carrito 🛒 <span id="contador-carrito">{totalItems}</span>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
