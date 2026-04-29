import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer';

export default function Confirmacion() {
  const navigate = useNavigate();
  const [pedido, setPedido] = useState(null);

  useEffect(() => {
    const guardado = localStorage.getItem('pedido-actual');
    if (!guardado) { navigate('/'); return; }
    setPedido(JSON.parse(guardado));
  }, [navigate]);

  if (!pedido) return null;

  return (
    <>
      <main>
        <section className="confirmacion-section">
          <div className="confirmacion-icono">
            <img src="/img/estado-de-pago.png" alt="Pago exitoso" className="pago-exitoso" />
          </div>

          <h2>¡Pedido recibido! 🎉</h2>
          <p className="confirmacion-subtitulo">
            Gracias por tu compra. Te contactaremos pronto para darte detalles de la entrega.
          </p>

          <div className="pedido-numero">
            <span>Número de pedido:</span>
            <strong>#{pedido.id}</strong>
          </div>

          <div className="confirmacion-resumen">
            <h3>Resumen de tu pedido</h3>

            <div className="confirmacion-cliente">
              <strong>📦 Datos de entrega</strong><br />
              {pedido.cliente.nombre}<br />
              {pedido.cliente.email}<br />
              {pedido.cliente.telefono}<br />
              {pedido.cliente.direccion}
              {pedido.cliente.nota && <><br />{pedido.cliente.nota}</>}
            </div>

            <div className="confirmacion-items">
              {pedido.items.map(item => (
                <div className="confirmacion-item" key={item.id}>
                  <span>{item.nombre} x{item.cantidad}</span>
                  <span>${(item.precio * item.cantidad).toLocaleString('es-CO')}</span>
                </div>
              ))}
            </div>

            <div className="confirmacion-total">
              <span>Total pagado</span>
              <strong>${pedido.total.toLocaleString('es-CO')}</strong>
            </div>
          </div>

          <div className="confirmacion-acciones">
            <Link to="/" className="btn-primary">Seguir comprando</Link>
            <a
              href="https://instagram.com/sorprendeme_med"
              target="_blank"
              rel="noreferrer"
              className="btn-secundario"
            >
              <img src="/img/logoInstagram.png" alt="Instagram" className="icono-red-social" />
              Síguenos en Instagram
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
