import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarrito } from '../../context/CarritoContext';
import { useAuth } from '../../context/AuthContext';
import Footer from '../../components/Footer';

export default function Checkout() {
  const navigate = useNavigate();
  const { carrito, subtotal, envio, total, vaciar } = useCarrito();
  const { usuarioActual } = useAuth();

  const [form, setForm] = useState({
    nombre: usuarioActual?.nombre || '',
    email: usuarioActual?.email || '',
    telefono: '',
    direccion: '',
    nota: '',
  });
  const [errores, setErrores] = useState({});

  function cambiar(campo, valor) {
    setForm(f => ({ ...f, [campo]: valor }));
    setErrores(e => ({ ...e, [campo]: '' }));
  }

  function validar() {
    const nuevos = {};
    if (form.nombre.trim().length < 3) nuevos.nombre = 'Ingresa tu nombre completo';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nuevos.email = 'Correo no válido';
    if (form.telefono.trim().length < 10) nuevos.telefono = 'Teléfono no válido';
    if (form.direccion.trim().length < 5) nuevos.direccion = 'Ingresa tu dirección completa';
    setErrores(nuevos);
    return Object.keys(nuevos).length === 0;
  }

  function handlePagar() {
    if (!validar()) return;
    if (carrito.length === 0) { navigate('/carrito'); return; }

    const pedido = {
      id: Date.now(),
      fecha: new Date().toLocaleDateString('es-CO'),
      cliente: {
        nombre: form.nombre,
        email: form.email,
        telefono: form.telefono,
        direccion: form.direccion,
        nota: form.nota,
      },
      items: carrito,
      subtotal,
      envio,
      total,
      estado: 'pendiente',
    };

    // Guardar en lista de pedidos
    const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    pedidos.push(pedido);
    localStorage.setItem('pedidos', JSON.stringify(pedidos));

    // Guardar pedido actual para confirmación
    localStorage.setItem('pedido-actual', JSON.stringify(pedido));

    vaciar();
    navigate('/confirmacion');
  }

  return (
    <>
      <main>
        <section className="checkout-section">
          <h2>Finalizar Pedido 🎁</h2>
          <div className="checkout-container">

            {/* Formulario */}
            <div className="checkout-form">
              <h3>Tus datos</h3>

              {[
                { id: 'nombre', label: 'Nombre completo *', type: 'text', placeholder: 'Ej: María Bonilla' },
                { id: 'email', label: 'Correo electrónico *', type: 'email', placeholder: 'Ej: maria@gmail.com' },
                { id: 'telefono', label: 'Teléfono *', type: 'tel', placeholder: 'Ej: 3001234567' },
                { id: 'direccion', label: 'Dirección de envío *', type: 'text', placeholder: 'Ej: Calle 50 #30-20, Medellín' },
              ].map(({ id, label, type, placeholder }) => (
                <div className="form-grupo" key={id}>
                  <label htmlFor={id}>{label}</label>
                  <input
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    value={form[id]}
                    onChange={e => cambiar(id, e.target.value)}
                    className={errores[id] ? 'invalido' : ''}
                  />
                  {errores[id] && <span className="error-msg">{errores[id]}</span>}
                </div>
              ))}

              <div className="form-grupo">
                <label htmlFor="nota">Nota especial (opcional)</label>
                <textarea
                  id="nota"
                  rows="3"
                  placeholder="Ej: Es un regalo, por favor incluir tarjeta"
                  value={form.nota}
                  onChange={e => cambiar('nota', e.target.value)}
                />
              </div>

              <button className="btn-primary" onClick={handlePagar}>
                🔒 Pagar con MercadoPago
              </button>
              <img src="/img/mercadoPago.png" alt="Mercado Pago" className="mercado-pago-logo" />
            </div>

            {/* Resumen */}
            <div className="checkout-resumen">
              <h3>Tu pedido</h3>
              {carrito.map(item => (
                <div className="resumen-item-checkout" key={item.id}>
                  <span>{item.nombre} x{item.cantidad}</span>
                  <span>${(item.precio * item.cantidad).toLocaleString('es-CO')}</span>
                </div>
              ))}
              <div className="resumen-linea">
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString('es-CO')}</span>
              </div>
              <div className="resumen-linea">
                <span>Envío</span>
                <span>${envio.toLocaleString('es-CO')}</span>
              </div>
              <div className="resumen-linea total">
                <span>Total</span>
                <span>${total.toLocaleString('es-CO')}</span>
              </div>
            </div>

          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
