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
  eliminarTodosLosElementos,
  reordenarElementos,
} from '../services/itemService';
import { crearInvitacion } from '../services/inviteService';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import toast from 'react-hot-toast';

function SortableElemento({
  elemento,
  editandoItemId,
  textoEdit,
  setTextoEdit,
  handleEditarElemento,
  cancelarEdicionItem,
  editarMutation,
  toggleMutation,
  iniciarEdicionItem,
  eliminarMutation,
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: elemento.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 'auto',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => toggleMutation.mutate(elemento.id)}
      className={`bg-white rounded-2xl p-3 sm:p-4 shadow-soft transition-shadow transition-opacity duration-200 ${isDragging ? 'shadow-elevated ring-2 ring-brand-400' : ''}`}
    >
      {editandoItemId === elemento.id ? (
        <form onClick={(e) => e.stopPropagation()} onSubmit={(e) => handleEditarElemento(e, elemento.id)} className="space-y-2">
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
        <div className="flex items-center gap-3">
          {/* Drag handle */}
          <button
            {...attributes}
            {...listeners}
            onClick={(e) => e.stopPropagation()}
            style={{ touchAction: 'none' }}
            className="w-11 h-11 rounded-xl flex items-center justify-center text-surface-300 hover:bg-surface-100 hover:text-surface-500 active:bg-surface-200 transition-colors flex-shrink-0 cursor-grab active:cursor-grabbing"
            title="Arrastrar"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
            </svg>
          </button>

          {/* Checkbox (visual) */}
          <div
            className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
              elemento.completado
                ? 'bg-brand-500 border-brand-500'
                : 'border-surface-300'
            }`}
          >
            {elemento.completado && (
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>

          {/* Text */}
          <span
            className={`flex-1 text-sm sm:text-base transition-all duration-200 min-w-0 ${
              elemento.completado ? 'line-through text-surface-400' : 'text-surface-700'
            }`}
          >
            {elemento.texto}
          </span>

          {/* Action buttons */}
          <div className="flex gap-1 flex-shrink-0">
            <button
              onClick={(e) => { e.stopPropagation(); iniciarEdicionItem(elemento); }}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-surface-300 hover:bg-brand-50 hover:text-brand-600 active:bg-brand-100 transition-colors"
              title="Editar"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
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
  );
}

export default function ListDetailPage() {
  const { id } = useParams();
  const [nuevoElemento, setNuevoElemento] = useState('');
  const [mostrarInvitacion, setMostrarInvitacion] = useState(false);
  const [enlaceInvitacion, setEnlaceInvitacion] = useState('');
  const [copiado, setCopiado] = useState(false);
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

  const { data: elementos, isLoading: cargandoElementos } = useQuery({
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

  const vaciarListaMutation = useMutation({
    mutationFn: () => eliminarTodosLosElementos(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['elementos', id]);
      toast.success('Lista vaciada');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error al vaciar lista');
    },
  });

  const reordenarMutation = useMutation({
    mutationFn: (orden) => reordenarElementos(id, orden),
    onSuccess: () => {
      queryClient.invalidateQueries(['elementos', id]);
    },
  });

  const invitacionMutation = useMutation({
    mutationFn: () => crearInvitacion(id),
    onSuccess: (data) => {
      setEnlaceInvitacion(data.data.enlace);
      toast.success('Enlace generado');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error al generar enlace');
    },
  });

  useEffect(() => {
    if (id) {
      unirseALista(id);

      const handleConnect = () => unirseALista(id);
      const handleElementoCreado = () => queryClient.invalidateQueries(['elementos', id]);
      const handleElementoCompletado = () => queryClient.invalidateQueries(['elementos', id]);
      const handleElementoActualizado = () => queryClient.invalidateQueries(['elementos', id]);
      const handleElementoEliminado = () => queryClient.invalidateQueries(['elementos', id]);
      const handleElementosReordenados = () => queryClient.invalidateQueries(['elementos', id]);
      const handleElementosEliminados = () => queryClient.invalidateQueries(['elementos', id]);

      escucharEvento('connect', handleConnect);
      escucharEvento('elemento-creado', handleElementoCreado);
      escucharEvento('elemento-completado', handleElementoCompletado);
      escucharEvento('elemento-actualizado', handleElementoActualizado);
      escucharEvento('elemento-eliminado', handleElementoEliminado);
      escucharEvento('elementos-reordenados', handleElementosReordenados);
      escucharEvento('elementos-eliminados', handleElementosEliminados);

      return () => {
        dejarDeEscuchar('connect', handleConnect);
        dejarDeEscuchar('elemento-creado', handleElementoCreado);
        dejarDeEscuchar('elemento-completado', handleElementoCompletado);
        dejarDeEscuchar('elemento-actualizado', handleElementoActualizado);
        dejarDeEscuchar('elemento-eliminado', handleElementoEliminado);
        dejarDeEscuchar('elementos-reordenados', handleElementosReordenados);
        dejarDeEscuchar('elementos-eliminados', handleElementosEliminados);
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

  function handleGenerarEnlace() {
    invitacionMutation.mutate();
  }

  async function handleCopiarEnlace() {
    try {
      await navigator.clipboard.writeText(enlaceInvitacion);
      setCopiado(true);
      toast.success('Enlace copiado');
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      toast.error('No se pudo copiar');
    }
  }

  function handleCompartirWhatsApp() {
    const texto = `Únete a la lista "${lista?.nombre}" en WeList: ${enlaceInvitacion}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`, '_blank');
  }

  function handleCompartirTelegram() {
    const url = enlaceInvitacion;
    const texto = `Únete a la lista "${lista?.nombre}" en WeList`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(texto)}`, '_blank');
  }

  function handleCompartirEmail() {
    const asunto = `Invitación a lista "${lista?.nombre}" en WeList`;
    const cuerpo = `Únete a mi lista en WeList: ${enlaceInvitacion}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
  }

  function handleAbrirInvitacion() {
    setEnlaceInvitacion('');
    setCopiado(false);
    setMostrarInvitacion(true);
  }

  function handleCerrarInvitacion() {
    setMostrarInvitacion(false);
    setEnlaceInvitacion('');
    setCopiado(false);
  }

  function handleVaciarLista() {
    if (confirm('¿Estás seguro de eliminar todos los elementos de esta lista?')) {
      vaciarListaMutation.mutate();
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  );

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = elementos.findIndex((e) => e.id === active.id);
    const newIndex = elementos.findIndex((e) => e.id === over.id);
    const nuevoOrden = arrayMove(elementos, oldIndex, newIndex);

    queryClient.setQueryData(['elementos', id], nuevoOrden);

    const orden = nuevoOrden.map((e, i) => ({ id: e.id, posicion: i }));
    reordenarMutation.mutate(orden);
  }

  const completados = elementos?.filter((e) => e.completado).length || 0;
  const total = elementos?.length || 0;
  const porcentaje = total > 0 ? Math.round((completados / total) * 100) : 0;

  const colaboradores = lista?.colaboradores?.filter((c) => c.usuario.id !== usuario?.id) || [];

  const COLORS = ['bg-brand-500', 'bg-accent-400', 'bg-success-500', 'bg-brand-700', 'bg-accent-600', 'bg-brand-300'];
  function getAvatarColor(nombre) {
    let hash = 0;
    for (let i = 0; i < nombre.length; i++) hash = nombre.charCodeAt(i) + ((hash << 5) - hash);
    return COLORS[Math.abs(hash) % COLORS.length];
  }
  function getInitials(nombre) {
    return nombre.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
  }

  if (cargandoLista || cargandoElementos) {
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
              onClick={handleAbrirInvitacion}
              className="btn-primary py-2 px-3 sm:px-4 text-xs sm:text-sm flex items-center gap-1 sm:gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              <span className="hidden sm:inline">Invitar</span>
            </button>
            {elementos && elementos.length > 0 && (
              <button
                onClick={handleVaciarLista}
                disabled={vaciarListaMutation.isLoading}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-surface-100 flex items-center justify-center text-surface-400 hover:bg-red-50 hover:text-red-500 active:bg-red-100 transition-colors flex-shrink-0"
                title="Vaciar lista"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
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

        {/* Collaborators */}
        {colaboradores.length > 0 && (
          <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-soft mb-6 sm:mb-8">
            <p className="text-xs sm:text-sm font-medium text-surface-600 mb-3">Compartido con</p>
            <div className="flex flex-wrap gap-3">
              {colaboradores.map((c) => (
                <div key={c.usuario.id} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full ${getAvatarColor(c.usuario.nombre)} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                    {getInitials(c.usuario.nombre)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-surface-700 truncate">{c.usuario.nombre}</p>
                    <p className="text-xs text-surface-400">{c.rol === 'PROPIETARIO' ? 'Propietario' : c.rol === 'EDITOR' ? 'Editor' : 'Lector'}</p>
                  </div>
                </div>
              ))}
            </div>
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
              className="input-field flex-1 text-base"
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
                  <span>Añadir</span>
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
                  <p className="text-sm text-surface-400 mt-1">Genera un enlace y compártelo</p>
                </div>
                <button
                  onClick={handleCerrarInvitacion}
                  className="w-8 h-8 rounded-xl bg-surface-100 flex items-center justify-center text-surface-400 hover:text-surface-600 hover:bg-surface-200 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {enlaceInvitacion ? (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">Enlace de invitación</label>
                    <div className="flex gap-2">
                      <input
                        readOnly
                        value={enlaceInvitacion}
                        className="input-field flex-1 text-sm"
                      />
                      <button onClick={handleCopiarEnlace} className="btn-primary px-4 flex items-center gap-2 flex-shrink-0">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span className="hidden sm:inline">{copiado ? 'Copiado' : 'Copiar'}</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-surface-700 mb-3">Compartir por</p>
                    <div className="flex gap-3">
                      <button onClick={handleCompartirWhatsApp} className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-green-500 text-white font-medium hover:bg-green-600 transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        <span className="text-sm">WhatsApp</span>
                      </button>
                      <button onClick={handleCompartirTelegram} className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                        </svg>
                        <span className="text-sm">Telegram</span>
                      </button>
                      <button onClick={handleCompartirEmail} className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-surface-200 text-surface-700 font-medium hover:bg-surface-300 transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm">Email</span>
                      </button>
                    </div>
                  </div>

                  <button onClick={handleCerrarInvitacion} className="btn-ghost w-full justify-center">
                    Cerrar
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-surface-500">
                    Genera un enlace único para compartir con quien quieras invitar a esta lista.
                  </p>
                  <div className="flex justify-end gap-3">
                    <button onClick={handleCerrarInvitacion} className="btn-ghost">
                      Cancelar
                    </button>
                    <button onClick={handleGenerarEnlace} disabled={invitacionMutation.isLoading} className="btn-primary flex items-center gap-2">
                      {invitacionMutation.isLoading ? (
                        <>
                          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Generando...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                          Generar enlace
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Elements list */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={elementos?.map((e) => e.id)} strategy={verticalListSortingStrategy}>
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
                  <SortableElemento
                    key={elemento.id}
                    elemento={elemento}
                    editandoItemId={editandoItemId}
                    textoEdit={textoEdit}
                    setTextoEdit={setTextoEdit}
                    handleEditarElemento={handleEditarElemento}
                    cancelarEdicionItem={cancelarEdicionItem}
                    editarMutation={editarMutation}
                    toggleMutation={toggleMutation}
                    iniciarEdicionItem={iniciarEdicionItem}
                    eliminarMutation={eliminarMutation}
                  />
                ))
              )}
            </div>
          </SortableContext>
        </DndContext>
      </main>
    </div>
  );
}
