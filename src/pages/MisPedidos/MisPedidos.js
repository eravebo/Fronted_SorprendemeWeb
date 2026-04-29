import { useAuth } from '../../context/AuthContext';
import Footer from '../../components/Footer';
import { Link } from 'react-router-dom';

export default function MisPedidos() {
  const { usuarioActual } = useAuth();
  const todos = JSON.parse(localStorage.getItem('pedidos')) || [];
  // Filtra pedidos del usuario logueado por email
  const misPedidos = todos.filter(p => p.cliente.email === usuarioActual?.email);
  const ordenados = [...misPedidos].sort((a, b) => b.id - a.id);

  return (
    <>
      <main>
        <section className="checkout-section">
          <h2>Mis Pedidos 📦</h2>

          {ordenados.length === 0 ? (
            <div className="carrito-vacio">
              <p>Aún no tienes pedidos.</p>
              <Link to="/" className="btn-primary">Explorar productos</Link>
            </div>
          ) : (
            <div className="tabla-container">
              <table className="admin-tabla">
                <thead>
                  <tr>
                    <th>#Pedido</th>
                    <th>Fecha</th>
                    <th>Productos</th>
                    <th>Total</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {ordenados.map(p => (
                    <tr key={p.id}>
                      <td>#{p.id}</td>
                      <td>{p.fecha}</td>
                      <td>
                        {p.items.map(i => (
                          <div key={i.id} style={{ fontSize: '0.85rem' }}>
                            {i.nombre} x{i.cantidad}
                          </div>
                        ))}
                      </td>
                      <td>${p.total.toLocaleString('es-CO')}</td>
                      <td>
                        <span className={`badge badge-${p.estado}`}>{p.estado}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
