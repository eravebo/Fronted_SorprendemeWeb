import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getProductos, guardarProductos } from '../../data/productos';

const CATEGORIAS = ['ancheta', 'flores', 'peluche'];
const FORM_VACIO = { nombre: '', categoria: '', precio: '', stock: '', descripcion: '', imagen: '' };

export default function Admin() {
  const { adminLogueado, loginAdmin, logoutAdmin } = useAuth();

  // ── Login admin ──
  const [credenciales, setCredenciales] = useState({ usuario: '', password: '' });
  const [errorLogin, setErrorLogin] = useState('');

  function handleLoginAdmin(e) {
    e.preventDefault();
    const res = loginAdmin(credenciales.usuario, credenciales.password);
    if (!res.ok) setErrorLogin(res.msg);
  }

  // ── Panel ──
  const [tabActivo, setTabActivo] = useState('productos');
  const [productos, setProductos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState(FORM_VACIO);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (adminLogueado) {
      setProductos(getProductos());
      setPedidos(JSON.parse(localStorage.getItem('pedidos')) || []);
    }
  }, [adminLogueado]);

  function cambiarForm(campo, valor) {
    setForm(f => ({ ...f, [campo]: valor }));
  }

  function abrirNuevo() {
    setEditandoId(null);
    setForm(FORM_VACIO);
    setFormError('');
    setMostrarForm(true);
  }

  function abrirEditar(producto) {
    setEditandoId(producto.id);
    setForm({
      nombre: producto.nombre,
      categoria: producto.categoria,
      precio: producto.precio,
      stock: producto.stock ?? '',
      descripcion: producto.descripcion,
      imagen: producto.imagen,
    });
    setFormError('');
    setMostrarForm(true);
  }

  function cancelarForm() {
    setMostrarForm(false);
    setForm(FORM_VACIO);
    setEditandoId(null);
  }

  function guardar() {
    const { nombre, categoria, precio, descripcion, imagen } = form;
    if (!nombre || !categoria || !precio || !descripcion || !imagen) {
      setFormError('Completa todos los campos obligatorios');
      return;
    }

    let nueva = [...productos];
    if (editandoId === null) {
      nueva.push({ id: Date.now(), nombre, categoria, precio: Number(precio), stock: Number(form.stock) || 0, descripcion, imagen });
    } else {
      nueva = nueva.map(p => p.id === editandoId
        ? { ...p, nombre, categoria, precio: Number(precio), stock: Number(form.stock) || 0, descripcion, imagen }
        : p
      );
    }

    guardarProductos(nueva);
    setProductos(nueva);
    cancelarForm();
  }

  function eliminar(id) {
    if (!window.confirm('¿Eliminar este producto?')) return;
    const nueva = productos.filter(p => p.id !== id);
    guardarProductos(nueva);
    setProductos(nueva);
  }

  // ── Vista: Login ──
  if (!adminLogueado) {
    return (
      <div className="login-container">
        <div className="login-card">
          <h2>Administrador</h2>
          <p>Sorpréndeme</p>
          <form onSubmit={handleLoginAdmin}>
            <div className="form-grupo">
              <label>Usuario</label>
              <input
                type="text"
                placeholder="usuario"
                value={credenciales.usuario}
                onChange={e => setCredenciales(c => ({ ...c, usuario: e.target.value }))}
              />
            </div>
            <div className="form-grupo">
              <label>Contraseña</label>
              <input
                type="password"
                placeholder="contraseña"
                value={credenciales.password}
                onChange={e => setCredenciales(c => ({ ...c, password: e.target.value }))}
              />
            </div>
            {errorLogin && <span className="error-msg">{errorLogin}</span>}
            <button type="submit" className="btn-primary btn-block" style={{ marginTop: '1rem' }}>
              Ingresar
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Vista: Panel ──
  const pedidosOrdenados = [...pedidos].sort((a, b) => b.id - a.id);

  return (
    <div className="admin-container" style={{ display: 'block' }}>
      {/* Header */}
      <header className="admin-header">
        <h1>Panel Admin — Sorpréndeme</h1>
        <button className="btn-logout" onClick={logoutAdmin}>Cerrar sesión</button>
      </header>

      {/* Tabs */}
      <div className="admin-tabs">
        {['productos', 'pedidos'].map(t => (
          <button
            key={t}
            className={`tab-btn ${tabActivo === t ? 'activo' : ''}`}
            onClick={() => setTabActivo(t)}
          >
            {t === 'productos' ? '📦 Productos' : '🛒 Pedidos'}
          </button>
        ))}
      </div>

      {/* ── TAB PRODUCTOS ── */}
      {tabActivo === 'productos' && (
        <div className="tab-content">
          <div className="admin-toolbar">
            <h2>Gestión de Productos</h2>
            <button className="btn-primary" onClick={abrirNuevo}>+ Nuevo Producto</button>
          </div>

          {/* Formulario */}
          {mostrarForm && (
            <div className="producto-form-container">
              <h3>{editandoId ? 'Editar Producto' : 'Nuevo Producto'}</h3>
              <div className="producto-form-grid">
                <div className="form-grupo">
                  <label>Nombre *</label>
                  <input type="text" placeholder="Ej: Ancheta Romántica" value={form.nombre} onChange={e => cambiarForm('nombre', e.target.value)} />
                </div>
                <div className="form-grupo">
                  <label>Categoría *</label>
                  <select value={form.categoria} onChange={e => cambiarForm('categoria', e.target.value)}>
                    <option value="">Selecciona...</option>
                    {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-grupo">
                  <label>Precio *</label>
                  <input type="number" placeholder="Ej: 85000" value={form.precio} onChange={e => cambiarForm('precio', e.target.value)} />
                </div>
                <div className="form-grupo">
                  <label>Stock *</label>
                  <input type="number" placeholder="Ej: 10" value={form.stock} onChange={e => cambiarForm('stock', e.target.value)} />
                </div>
                <div className="form-grupo form-grupo-full">
                  <label>Descripción *</label>
                  <textarea rows="2" placeholder="Descripción corta del producto" value={form.descripcion} onChange={e => cambiarForm('descripcion', e.target.value)} />
                </div>
                <div className="form-grupo form-grupo-full">
                  <label>URL de imagen *</label>
                  <input type="text" placeholder="/img/producto.jpg" value={form.imagen} onChange={e => cambiarForm('imagen', e.target.value)} />
                </div>
              </div>
              {formError && <span className="error-msg">{formError}</span>}
              <div className="form-acciones">
                <button className="btn-primary" onClick={guardar}>Guardar</button>
                <button className="btn-secundario" onClick={cancelarForm}>Cancelar</button>
              </div>
            </div>
          )}

          {/* Tabla */}
          <div className="tabla-container">
            <table className="admin-tabla">
              <thead>
                <tr>
                  <th>Imagen</th><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.length === 0 ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center', color: '#888', padding: '2rem' }}>No hay productos</td></tr>
                ) : productos.map(p => (
                  <tr key={p.id}>
                    <td><img src={p.imagen} alt={p.nombre} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px' }} /></td>
                    <td>{p.nombre}</td>
                    <td>{p.categoria}</td>
                    <td>${p.precio.toLocaleString('es-CO')}</td>
                    <td>{p.stock ?? 'N/A'}</td>
                    <td>
                      <button className="btn-editar" onClick={() => abrirEditar(p)}>✏️ Editar</button>
                      <button className="btn-eliminar-prod" onClick={() => eliminar(p.id)} style={{ marginLeft: '0.5rem' }}>🗑 Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB PEDIDOS ── */}
      {tabActivo === 'pedidos' && (
        <div className="tab-content">
          <div className="admin-toolbar">
            <h2>Pedidos Recibidos</h2>
          </div>
          <div className="tabla-container">
            <table className="admin-tabla">
              <thead>
                <tr>
                  <th>#Pedido</th><th>Cliente</th><th>Teléfono</th><th>Fecha</th><th>Total</th><th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {pedidosOrdenados.length === 0 ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center', color: '#888', padding: '2rem' }}>No hay pedidos aún</td></tr>
                ) : pedidosOrdenados.map(p => (
                  <tr key={p.id}>
                    <td>#{p.id}</td>
                    <td>
                      <strong>{p.cliente.nombre}</strong><br />
                      <small>{p.cliente.email}</small>
                    </td>
                    <td>{p.cliente.telefono}</td>
                    <td>{p.fecha}</td>
                    <td>${p.total.toLocaleString('es-CO')}</td>
                    <td><span className={`badge badge-${p.estado}`}>{p.estado}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
