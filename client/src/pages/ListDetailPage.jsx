import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../hooks/useSocket';
import { obtenerListaPorId } from '../services/listService';
import {
  obtenerElementos,
  crearElemento,
  editarElemento,
  toggleCompletado,
  eliminarElemento,
} from '../services/itemService';
import { enviarInvitacion } from '../services/inviteService';
import toast from 'react-hot-toast';

export default function ListDetailPage() {
  const { id } = useParams();
  const [nuevoElemento, setNuevoElemento] = useState('');
  const [emailInvitado, setEmailInvitado] = useState('');
  const [mostrarInvitacion, setMostrarInvitacion] = useState(false);
  const [editandoItemId, setEditandoItemId] = useState(null);
  const [textoEdit, setTextoEdit] = useState('');
  const { usuario, logout } = useAuth();
  const queryClient = useQueryClient();
  const { unirseALista, escucharEvento, dejarDeEscuchar } = useSocket();
  const navigate = useNavigate();

  const { data: lista, isLoading: cargandoLista } = useQuery({
    queryKey: ['lista', id],
    queryFn: async () => {
      const response = await obtenerListaPorId(id);
      return response.data;
    },
  });

  const { data: elementos } = useQuery({
    queryKey: ['elementos', id],
    queryFn: async () => {
      const response = await obtenerElementos(id);
      return response.data;
    },
  });

  const crearMutation = useMutation({
    mutationFn: (texto) => crearElemento(id, texto),
    onSuccess: () => {
      queryClient.invalidateQueries(['elementos', id]);
      setNuevoElemento('');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error al crear elemento');
    },
  });

  const editarMutation = useMutation({
    mutationFn: ({ elementoId, datos }) => editarElemento(id, elementoId, datos),
    onSuccess: () => {
      queryClient.invalidateQueries(['elementos', id]);
      toast.success('Elemento actualizado');
      setEditandoItemId(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error al editar elemento');
    },
  });

  const toggleMutation = useMutation({
    mutationFn: (elementoId) => toggleCompletado(id, elementoId),
    onSuccess: () => {
      queryClient.invalidateQueries(['elementos', id]);
    },
  });

  const eliminarMutation = useMutation({
    mutationFn: (elementoId) => eliminarElemento(id, elementoId),
    onSuccess: () => {
      queryClient.invalidateQueries(['elementos', id]);
      toast.success('Elemento eliminado');
    },
  });

  const invitacionMutation = useMutation({
    mutationFn: (email) => enviarInvitacion(id, email),
    onSuccess: () => {
      toast.success('Invitación enviada');
      setEmailInvitado('');
      setMostrarInvitacion(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error al enviar invitación');
    },
  });

  useEffect(() => {
    if (id) {
      unirseALista(id);

      const handleElementoCreado = () => queryClient.invalidateQueries(['elementos', id]);
      const handleElementoCompletado = () => queryClient.invalidateQueries(['elementos', id]);
      const handleElementoEliminado = () => queryClient.invalidateQueries(['elementos', id]);

      escucharEvento('elemento-creado', handleElementoCreado);
      escucharEvento('elemento-completado', handleElementoCompletado);
      escucharEvento('elemento-eliminado', handleElementoEliminado);

      return () => {
        dejarDeEscuchar('elemento-creado', handleElementoCreado);
        dejarDeEscuchar('elemento-completado', handleElementoCompletado);
        dejarDeEscuchar('elemento-eliminado', handleElementoEliminado);
      };
    }
  }, [id]);

  function handleCrearElemento(e) {
    e.preventDefault();
    if (nuevoElemento.trim()) {
      crearMutation.mutate(nuevoElemento.trim());
    }
  }

  function handleEditarElemento(e, elementoId) {
    e.preventDefault();
    if (textoEdit.trim()) {
      editarMutation.mutate({ elementoId, datos: { texto: textoEdit.trim() } });
    }
  }

  function iniciarEdicionItem(elemento) {
    setEditandoItemId(elemento.id);
    setTextoEdit(elemento.texto);
  }

  function cancelarEdicionItem() {
    setEditandoItemId(null);
  }

  function handleInvitar(e) {
    e.preventDefault();
    if (emailInvitado.trim()) {
      invitacionMutation.mutate(emailInvitado.trim());
    }
  }

  const completados = elementos?.filter((e) => e.completado).length || 0;
  const total = elementos?.length || 0;
  const porcentaje = total > 0 ? Math.round((completados / total) * 100) : 0;

  if (cargandoLista) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
          <p className="text-surface-500 font-medium">Cargando lista...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Navbar */}
      <nav className="glass sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <Link
              to="/dashboard"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-surface-100 flex items-center justify-center text-surface-500 hover:bg-surface-200 hover:text-surface-700 transition-colors flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div className="min-w-0">
              <h1 className="font-display text-base sm:text-xl font-semibold text-surface-900 truncate">
                {lista?.nombre}
              </h1>
              {lista?.descripcion && (
                <p className="text-xs sm:text-sm text-surface-400 truncate">{lista.descripcion}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <button
              onClick={() => setMostrarInvitacion(true)}
              className="btn-primary py-2 px-3 sm:px-4 text-xs sm:text-sm flex items-center gap-1 sm:gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              <span className="hidden sm:inline">Invitar</span>
            </button>
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

      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-3xl">
        {/* Progress card */}
        {total > 0 && (
          <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-soft mb-6 sm:mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs sm:text-sm font-medium text-surface-600">Progreso</span>
              <span className="text-xs sm:text-sm font-semibold text-brand-600">{porcentaje}%</span>
            </div>
            <div className="h-2 bg-surface-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-500 to-brand-600 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${porcentaje}%` }}
              />
            </div>
            <p className="text-xs text-surface-400 mt-2">
              {completados} de {total} elementos completados
            </p>
          </div>
        )}

        {/* Add element form */}
        <form onSubmit={handleCrearElemento} className="mb-6 sm:mb-8">
          <div className="flex gap-2 sm:gap-3">
            <input
              type="text"
              value={nuevoElemento}
              onChange={(e) => setNuevoElemento(e.target.value)}
              placeholder="Añadir nuevo elemento..."
              className="input-field flex-1 text-sm sm:text-base"
            />
            <button
              type="submit"
              disabled={crearMutation.isLoading}
              className="btn-primary px-4 sm:px-6 py-2.5 sm:py-3 flex items-center gap-2 flex-shrink-0"
            >
              {crearMutation.isLoading ? (
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="hidden sm:inline">Añadir</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Modal invitación */}
        {mostrarInvitacion && (
          <div className="fixed inset-0 bg-surface-900/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
            <div className="bg-white rounded-t-3xl sm:rounded-3xl p-6 w-full max-w-md sm:shadow-elevated animate-slide-up">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-display text-xl font-semibold text-surface-900">Invitar colaborador</h2>
                  <p className="text-sm text-surface-400 mt-1">Comparte esta lista con otros</p>
                </div>
                <button
                  onClick={() => setMostrarInvitacion(false)}
                  className="w-8 h-8 rounded-xl bg-surface-100 flex items-center justify-center text-surface-400 hover:text-surface-600 hover:bg-surface-200 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleInvitar}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-surface-700 mb-2">Email del colaborador</label>
                  <input
                    type="email"
                    required
                    value={emailInvitado}
                    onChange={(e) => setEmailInvitado(e.target.value)}
                    className="input-field"
                    placeholder="correo@ejemplo.com"
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => setMostrarInvitacion(false)} className="btn-ghost">
                    Cancelar
                  </button>
                  <button type="submit" disabled={invitacionMutation.isLoading} className="btn-primary flex items-center gap-2">
                    {invitacionMutation.isLoading ? 'Enviando...' : 'Enviar invitación'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Elements list */}
        <div className="space-y-2 sm:space-y-3">
          {elementos?.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-surface-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-surface-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-surface-500 font-medium mb-1 text-sm sm:text-base">No hay elementos aún</p>
              <p className="text-surface-400 text-xs sm:text-sm">Añade el primer elemento usando el campo de arriba</p>
            </div>
          ) : (
            elementos?.map((elemento) => (
              <div
                key={elemento.id}
                className="bg-white rounded-2xl p-3 sm:p-4 shadow-soft transition-all duration-200 hover:shadow-elevated"
              >
                {editandoItemId === elemento.id ? (
                  /* Edit mode */
                  <form onSubmit={(e) => handleEditarElemento(e, elemento.id)} className="space-y-2">
                    <input
                      type="text"
                      value={textoEdit}
                      onChange={(e) => setTextoEdit(e.target.value)}
                      className="input-field text-sm"
                      autoFocus
                    />
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={cancelarEdicionItem} className="btn-ghost text-xs px-3 py-1.5">
                        Cancelar
                      </button>
                      <button type="submit" disabled={editarMutation.isLoading || !textoEdit.trim()} className="btn-primary text-xs px-3 py-1.5">
                        Guardar
                      </button>
                    </div>
                  </form>
                ) : (
                  /* View mode */
                  <div className="flex items-center gap-3">
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleMutation.mutate(elemento.id)}
                      className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
                        elemento.completado
                          ? 'bg-brand-500 border-brand-500'
                          : 'border-surface-300 hover:border-brand-400'
                      }`}
                    >
                      {elemento.completado && (
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>

                    {/* Text */}
                    <span
                      className={`flex-1 text-sm sm:text-base transition-all duration-200 min-w-0 ${
                        elemento.completado ? 'line-through text-surface-400' : 'text-surface-700'
                      }`}
                    >
                      {elemento.texto}
                    </span>

                    {/* Action buttons - always visible */}
                    <div className="flex gap-1 flex-shrink-0">
                      <button
                        onClick={() => iniciarEdicionItem(elemento)}
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-surface-300 hover:bg-blue-50 hover:text-blue-500 active:bg-blue-100 transition-colors"
                        title="Editar"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('¿Eliminar este elemento?')) {
                            eliminarMutation.mutate(elemento.id);
                          }
                        }}
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-surface-300 hover:bg-red-50 hover:text-red-500 active:bg-red-100 transition-colors"
                        title="Eliminar"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
