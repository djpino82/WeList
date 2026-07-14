import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { obtenerUsuarios, restablecerPassword } from '../services/adminService';
import toast from 'react-hot-toast';

export default function AdminUsersPage() {
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: usuarios, isLoading } = useQuery({
    queryKey: ['admin-usuarios'],
    queryFn: async () => {
      const response = await obtenerUsuarios();
      return response.data;
    },
  });

  const resetMutation = useMutation({
    mutationFn: ({ usuarioId, password }) => restablecerPassword(usuarioId, password),
    onSuccess: () => {
      toast.success('Contraseña restablecida exitosamente');
      setModalAbierto(false);
      setUsuarioSeleccionado(null);
      setNuevaPassword('');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error al restablecer contraseña');
    },
  });

  function abrirModal(usuario) {
    setUsuarioSeleccionado(usuario);
    setNuevaPassword('');
    setModalAbierto(true);
  }

  function cerrarModal() {
    setModalAbierto(false);
    setUsuarioSeleccionado(null);
    setNuevaPassword('');
  }

  function handleRestablecer(e) {
    e.preventDefault();
    if (nuevaPassword.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    resetMutation.mutate({
      usuarioId: usuarioSeleccionado.id,
      password: nuevaPassword,
    });
  }

  function formatearFecha(fecha) {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Navbar */}
      <nav className="glass sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-brand-500 to-brand-700 rounded-2xl flex items-center justify-center shadow-glow">
              <svg className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <span className="font-display font-bold text-lg sm:text-xl gradient-text">WeList</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden sm:flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 font-medium">
                {usuario?.nombre?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-surface-800">{usuario?.nombre}</p>
                <p className="text-xs text-surface-400">Administrador</p>
              </div>
            </div>
            <button
              onClick={() => { logout(); navigate('/'); }}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-surface-100 flex items-center justify-center text-surface-400 hover:bg-red-50 hover:text-red-500 transition-colors"
              title="Cerrar sesión"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-surface-900 mb-1">
              Panel de Administrador
            </h1>
            <p className="text-surface-500 text-sm sm:text-base">
              {usuarios?.length ? `${usuarios.length} ${usuarios.length === 1 ? 'usuario' : 'usuarios'} registrados` : 'Cargando usuarios...'}
            </p>
          </div>
          <Link
            to="/dashboard"
            className="btn-ghost flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al dashboard
          </Link>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                <div className="h-5 bg-surface-100 rounded-xl w-1/3 mb-3" />
                <div className="h-4 bg-surface-100 rounded-xl w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-soft overflow-hidden">
            {/* Tabla desktop */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-surface-100">
                    <th className="text-left px-6 py-4 text-sm font-medium text-surface-500">Usuario</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-surface-500">Email</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-surface-500">Rol</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-surface-500">Registro</th>
                    <th className="text-right px-6 py-4 text-sm font-medium text-surface-500">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios?.map((u) => (
                    <tr key={u.id} className="border-b border-surface-50 hover:bg-surface-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-brand-400 to-brand-600 rounded-xl flex items-center justify-center text-white font-medium">
                            {u.nombre.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-surface-800">{u.nombre}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-surface-600">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                          u.rol === 'admin'
                            ? 'bg-brand-100 text-brand-700'
                            : 'bg-surface-100 text-surface-600'
                        }`}>
                          {u.rol === 'admin' ? 'Admin' : 'Usuario'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-surface-500">{formatearFecha(u.createdAt)}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => abrirModal(u)}
                          className="text-sm text-brand-600 hover:text-brand-700 font-medium transition-colors"
                        >
                          Restablecer contraseña
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cards mobile */}
            <div className="sm:hidden divide-y divide-surface-100">
              {usuarios?.map((u) => (
                <div key={u.id} className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-brand-400 to-brand-600 rounded-xl flex items-center justify-center text-white font-medium">
                      {u.nombre.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-surface-800 truncate">{u.nombre}</p>
                      <p className="text-sm text-surface-500 truncate">{u.email}</p>
                    </div>
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                      u.rol === 'admin'
                        ? 'bg-brand-100 text-brand-700'
                        : 'bg-surface-100 text-surface-600'
                    }`}>
                      {u.rol === 'admin' ? 'Admin' : 'Usuario'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-surface-400">{formatearFecha(u.createdAt)}</span>
                    <button
                      onClick={() => abrirModal(u)}
                      className="text-sm text-brand-600 hover:text-brand-700 font-medium transition-colors"
                    >
                      Restablecer contraseña
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modal restablecer contraseña */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-surface-900/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl p-6 w-full max-w-md sm:shadow-elevated animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-semibold text-surface-900">
                Restablecer contraseña
              </h2>
              <button
                onClick={cerrarModal}
                className="w-8 h-8 rounded-xl bg-surface-100 flex items-center justify-center text-surface-400 hover:text-surface-600 hover:bg-surface-200 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="bg-surface-50 rounded-2xl p-4 mb-6">
              <p className="text-sm text-surface-500 mb-1">Usuario:</p>
              <p className="font-medium text-surface-800">{usuarioSeleccionado?.nombre}</p>
              <p className="text-sm text-surface-500">{usuarioSeleccionado?.email}</p>
            </div>

            <form onSubmit={handleRestablecer}>
              <div className="mb-6">
                <label htmlFor="nuevaPassword" className="block text-sm font-medium text-surface-700 mb-2">
                  Nueva contraseña
                </label>
                <input
                  id="nuevaPassword"
                  type="password"
                  required
                  minLength={6}
                  value={nuevaPassword}
                  onChange={(e) => setNuevaPassword(e.target.value)}
                  className="input-field"
                  placeholder="Mínimo 6 caracteres"
                  autoFocus
                />
              </div>

              <div className="flex justify-end gap-3">
                <button type="button" onClick={cerrarModal} className="btn-ghost">
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={resetMutation.isLoading || nuevaPassword.length < 6}
                  className="btn-primary"
                >
                  {resetMutation.isLoading ? 'Guardando...' : 'Guardar contraseña'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
