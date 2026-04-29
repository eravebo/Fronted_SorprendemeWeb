import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CarritoProvider } from './context/CarritoContext';
import { PrivateRoute } from './components/PrivateRoute';
import Navbar from './components/Navbar';

import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Carrito from './pages/Carrito/Carrito';
import Checkout from './pages/Checkout/Checkout';
import Confirmacion from './pages/Confirmacion/Confirmacion';
import MisPedidos from './pages/MisPedidos/MisPedidos';
import Admin from './pages/Admin/Admin';

import './styles.css';

export default function App() {
  return (
    <AuthProvider>
      <CarritoProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/admin" element={<Admin />} />
            <Route path="/*" element={<PaginasPublicas />} />
          </Routes>
        </BrowserRouter>
      </CarritoProvider>
    </AuthProvider>
  );
}

function PaginasPublicas() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/confirmacion" element={<Confirmacion />} />
        <Route path="/checkout" element={
          <PrivateRoute><Checkout /></PrivateRoute>
        } />
        <Route path="/mis-pedidos" element={
          <PrivateRoute><MisPedidos /></PrivateRoute>
        } />
        <Route path="*" element={
          <div style={{ textAlign: 'center', padding: '5rem' }}>
            <h2>Página no encontrada 😕</h2>
            <a href="/" style={{ color: 'var(--color-primario)', marginTop: '1rem', display: 'inline-block' }}>
              Volver al inicio
            </a>
          </div>
        } />
      </Routes>
    </>
  );
}
