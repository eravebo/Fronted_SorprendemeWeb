import { useState, useEffect } from 'react';
import ProductoCard from '../../components/ProductoCard';
import Footer from '../../components/Footer';
import { getProductos } from '../../data/productos';

const CATEGORIAS = [
  { key: 'todas', label: 'Todas' },
  { key: 'ancheta', label: 'Anchetas' },
  { key: 'flores', label: 'Flores' },
  { key: 'peluche', label: 'Peluches' },
];

export default function Home() {
  const [categoriaActiva, setCategoriaActiva] = useState('todas');
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    setProductos(getProductos());
  }, []);

  const filtrados = categoriaActiva === 'todas'
    ? productos
    : productos.filter(p => p.categoria === categoriaActiva);

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <h1>Regalos que enamoran 💕</h1>
          <p>Descubre la magia de regalar con Sorpréndeme Medellín. Encuentra el detalle perfecto para cada ocasión.</p>
          <a href="#productos" className="btn">Explorar productos</a>
        </div>
      </section>

      {/* FILTROS */}
      <section className="filtros">
        <div className="filtros-container">
          {CATEGORIAS.map(c => (
            <button
              key={c.key}
              className={`filtro-btn ${categoriaActiva === c.key ? 'activo' : ''}`}
              onClick={() => setCategoriaActiva(c.key)}
            >
              {c.label}
            </button>
          ))}
        </div>
      </section>

      {/* CATÁLOGO */}
      <main>
        <section className="catalogo" id="productos">
          <h2>Nuestros Productos</h2>
          <div className="productos-grid">
            {filtrados.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#888', gridColumn: '1/-1' }}>
                No hay productos en esta categoría aún.
              </p>
            ) : (
              filtrados.map(p => <ProductoCard key={p.id} producto={p} />)
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
