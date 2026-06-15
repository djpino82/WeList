import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { obtenerListas, crearLista, editarLista, eliminarLista } from '../services/listService';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [nombreEdit, setNombreEdit] = useState('');
  const [descripcionEdit, setDescripcionEdit] = useState('');
  const { usuario, logout } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: listas, isLoading } = useQuery({
    queryKey: ['listas'],
    queryFn: async () => {
      const response = await obtenerListas();
      return response.data;
    },
  });

  const crearMutation = useMutation({
    mutationFn: crearLista,
    onSuccess: () => {
      queryClient.invalidateQueries(['listas']);
      toast.success('Lista creada');
      setMostrarFormulario(false);
      setNombre('');
      setDescripcion('');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error al crear lista');
    },
  });

  const editarMutation = useMutation({
    mutationFn: ({ id, datos }) => editarLista(id, datos),
    onSuccess: () => {
      queryClient.invalidateQueries(['listas']);
      toast.success('Lista actualizada');
      setEditandoId(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error al editar lista');
    },
  });

  const eliminarMutation = useMutation({
    mutationFn: eliminarLista,
    onSuccess: () => {
      queryClient.invalidateQueries(['listas']);
      toast.success('Lista eliminada');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error al eliminar lista');
    },
  });

  function handleCrearLista(e) {
    e.preventDefault();
    crearMutation.mutate({ nombre, descripcion });
  }

  function handleEditarLista(e) {
    e.preventDefault();
    if (nombreEdit.trim()) {
      editarMutation.mutate({ id: editandoId, datos: { nombre: nombreEdit, descripcion: descripcionEdit } });
    }
  }

  function iniciarEdicion(lista) {
    setEditandoId(lista.id);
    setNombreEdit(lista.nombre);
    setDescripcionEdit(lista.descripcion || '');
  }

  function cancelarEdicion() {
    setEditandoId(null);
  }

  function handleEliminar(id) {
    if (confirm('¿Estás seguro de eliminar esta lista? Se borrarán todos sus elementos.')) {
      eliminarMutation.mutate(id);
    }
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
                <p className="text-xs text-surface-400">{usuario?.email}</p>
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
              Mis listas
            </h1>
            <p className="text-surface-500 text-sm sm:text-base">
              {listas?.length ? `${listas.length} ${listas.length === 1 ? 'lista' : 'listas'} creadas` : 'Crea tu primera lista para comenzar'}
            </p>
          </div>
          <button
            onClick={() => setMostrarFormulario(true)}
            className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nueva lista
          </button>
        </div>

        {/* Modal crear lista */}
        {mostrarFormulario && (
          <div className="fixed inset-0 bg-surface-900/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
            <div className="bg-white rounded-t-3xl sm:rounded-3xl p-6 w-full max-w-md sm:shadow-elevated animate-slide-up">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-semibold text-surface-900">Crear lista</h2>
                <button
                  onClick={() => setMostrarFormulario(false)}
                  className="w-8 h-8 rounded-xl bg-surface-100 flex items-center justify-center text-surface-400 hover:text-surface-600 hover:bg-surface-200 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleCrearLista}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">Nombre</label>
                    <input
                      type="text"
                      required
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      className="input-field"
                      placeholder="Mi lista de compras"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">Descripción</label>
                    <textarea
                      value={descripcion}
                      onChange={(e) => setDescripcion(e.target.value)}
                      className="input-field resize-none"
                      placeholder="¿Para qué es esta lista?"
                      rows={3}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setMostrarFormulario(false)} className="btn-ghost">
                    Cancelar
                  </button>
                  <button type="submit" disabled={crearMutation.isLoading} className="btn-primary">
                    {crearMutation.isLoading ? 'Creando...' : 'Crear lista'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Content */}
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 animate-pulse">
                <div className="h-6 bg-surface-100 rounded-xl w-2/3 mb-4" />
                <div className="h-4 bg-surface-100 rounded-xl w-full mb-2" />
                <div className="h-4 bg-surface-100 rounded-xl w-1/2" />
              </div>
            ))}
          </div>
        ) : listas?.length === 0 ? (
          <div className="text-center py-16 sm:py-20">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-brand-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h3 className="font-display text-xl font-semibold text-surface-800 mb-2">No tienes listas aún</h3>
            <p className="text-surface-500 mb-6 max-w-sm mx-auto text-sm sm:text-base">
              Crea tu primera lista para empezar a organizar tus cosas con amigos, familia o equipo.
            </p>
            <button onClick={() => setMostrarFormulario(true)} className="btn-primary inline-flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Crear mi primera lista
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {listas?.map((lista) => (
              <div key={lista.id} className="bg-white rounded-3xl p-4 sm:p-6 shadow-soft transition-all duration-200 hover:shadow-elevated">
                {editandoId === lista.id ? (
                  /* Edit mode */
                  <form onSubmit={handleEditarLista}>
                    <div className="space-y-3 mb-4">
                      <input
                        type="text"
                        required
                        value={nombreEdit}
                        onChange={(e) => setNombreEdit(e.target.value)}
                        className="input-field text-sm"
                        autoFocus
                      />
                      <textarea
                        value={descripcionEdit}
                        onChange={(e) => setDescripcionEdit(e.target.value)}
                        className="input-field resize-none text-sm"
                        rows={2}
                        placeholder="Descripción (opcional)"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={cancelarEdicion} className="btn-ghost text-xs px-3 py-1.5">
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={editarMutation.isLoading || !nombreEdit.trim()}
                        className="btn-primary text-xs px-3 py-1.5"
                      >
                        Guardar
                      </button>
                    </div>
                  </form>
                ) : (
                  /* View mode */
                  <>
                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-brand-400 to-brand-600 rounded-2xl flex items-center justify-center text-white font-display font-semibold text-base sm:text-lg">
                        {lista.nombre.charAt(0).toUpperCase()}
                      </div>
                      {/* Action buttons - always visible */}
                      <div className="flex gap-1">
                        <button
                          onClick={() => iniciarEdicion(lista)}
                          className="w-8 h-8 rounded-xl bg-surface-100 flex items-center justify-center text-surface-400 hover:bg-blue-50 hover:text-blue-500 active:bg-blue-100 transition-colors"
                          title="Editar lista"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleEliminar(lista.id)}
                          className="w-8 h-8 rounded-xl bg-surface-100 flex items-center justify-center text-surface-400 hover:bg-red-50 hover:text-red-500 active:bg-red-100 transition-colors"
                          title="Eliminar lista"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <Link to={`/listas/${lista.id}`} className="block">
                      <h3 className="font-display text-base sm:text-lg font-semibold text-surface-800 mb-1 hover:text-brand-600 transition-colors">
                        {lista.nombre}
                      </h3>
                      {lista.descripcion && (
                        <p className="text-surface-500 text-sm mb-3 sm:mb-4 line-clamp-2">{lista.descripcion}</p>
                      )}
                      <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-surface-100">
                        <div className="flex items-center gap-2 text-surface-400">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          <span className="text-xs sm:text-sm">{lista._count?.elementos || 0} elementos</span>
                        </div>
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-surface-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
