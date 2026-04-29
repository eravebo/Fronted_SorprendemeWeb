import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuarioActual, setUsuarioActual] = useState(() => {
    const guardado = localStorage.getItem('usuario-session');
    return guardado ? JSON.parse(guardado) : null;
  });

  const [adminLogueado, setAdminLogueado] = useState(() => {
    return localStorage.getItem('admin-session') === 'true';
  });

  // ── Registro de usuario cliente ──
  function registrar(nombre, email, password) {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const existe = usuarios.find(u => u.email === email);
    if (existe) return { ok: false, msg: 'El correo ya está registrado' };

    const nuevo = { id: Date.now(), nombre, email, password };
    usuarios.push(nuevo);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    localStorage.setItem('usuario-session', JSON.stringify(nuevo));
    setUsuarioActual(nuevo);
    return { ok: true };
  }

  // ── Login de usuario cliente ──
  function login(email, password) {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const encontrado = usuarios.find(u => u.email === email && u.password === password);
    if (!encontrado) return { ok: false, msg: 'Correo o contraseña incorrectos' };

    localStorage.setItem('usuario-session', JSON.stringify(encontrado));
    setUsuarioActual(encontrado);
    return { ok: true };
  }

  function logout() {
    localStorage.removeItem('usuario-session');
    setUsuarioActual(null);
  }

  // ── Login de admin ──
  function loginAdmin(usuario, password) {
    if (usuario === 'admin' && password === 'sorprendeme123') {
      localStorage.setItem('admin-session', 'true');
      setAdminLogueado(true);
      return { ok: true };
    }
    return { ok: false, msg: 'Usuario o contraseña incorrectos' };
  }

  function logoutAdmin() {
    localStorage.removeItem('admin-session');
    setAdminLogueado(false);
  }

  return (
    <AuthContext.Provider value={{
      usuarioActual,
      adminLogueado,
      registrar,
      login,
      logout,
      loginAdmin,
      logoutAdmin,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
