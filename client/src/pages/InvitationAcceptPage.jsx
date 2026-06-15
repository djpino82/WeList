import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { verificarInvitacion, aceptarInvitacion } from '../services/inviteService';
import toast from 'react-hot-toast';

export default function InvitationAcceptPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const { data: invitacion, isLoading, error } = useQuery({
    queryKey: ['invitacion', token],
    queryFn: () => verificarInvitacion(token),
    retry: false,
  });

  const aceptarMutation = useMutation({
    mutationFn: () => aceptarInvitacion(token),
    onSuccess: (data) => {
      toast.success(data.message || 'Invitación aceptada');
      if (invitacion?.data?.lista?.id) {
        navigate(`/listas/${invitacion.data.lista.id}`);
      } else {
        navigate('/dashboard');
      }
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Error al aceptar invitación');
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  if (error) {
    const mensaje = error.response?.data?.message || 'Invitación no válida o expirada';
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50 p-6">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="font-display text-2xl font-bold text-surface-900 mb-2">Invitación no válida</h1>
          <p className="text-surface-500 mb-8">{mensaje}</p>
          <Link to="/" className="btn-primary inline-flex items-center gap-2">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  const datos = invitacion?.data;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50 p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2.5 justify-center mb-8">
            <div className="w-11 h-11 bg-gradient-to-br from-brand-500 to-brand-700 rounded-2xl flex items-center justify-center shadow-glow">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <span className="font-display font-bold text-xl gradient-text">WeList</span>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft text-center">
            <div className="w-16 h-16 bg-brand-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>

            <h1 className="font-display text-2xl font-bold text-surface-900 mb-2">
              Te han invitado a una lista
            </h1>
            <p className="text-surface-500 mb-2">
              <span className="font-medium text-surface-700">{datos?.emisor?.nombre}</span> te invitó a colaborar en
            </p>
            <p className="font-display text-xl font-semibold text-brand-600 mb-6">
              "{datos?.lista?.nombre}"
            </p>
            <p className="text-surface-400 text-sm mb-8">
              Para aceptar esta invitación, necesitas iniciar sesión o crear una cuenta.
            </p>

            <div className="space-y-3">
              <Link to="/login" className="btn-primary w-full flex items-center justify-center gap-2">
                Iniciar sesión
              </Link>
              <Link to="/registro" className="btn-secondary w-full flex items-center justify-center gap-2">
                Crear cuenta
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 p-6">
      <div className="w-full max-w-md">
        <div className="lg:hidden flex items-center gap-2.5 justify-center mb-8">
          <div className="w-11 h-11 bg-gradient-to-br from-brand-500 to-brand-700 rounded-2xl flex items-center justify-center shadow-glow">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <span className="font-display font-bold text-xl gradient-text">WeList</span>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft text-center">
          <div className="w-16 h-16 bg-brand-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>

          <h1 className="font-display text-2xl font-bold text-surface-900 mb-2">
            Invitación a colaborar
          </h1>
          <p className="text-surface-500 mb-2">
            <span className="font-medium text-surface-700">{datos?.emisor?.nombre}</span> te invita a colaborar en
          </p>
          <p className="font-display text-xl font-semibold text-brand-600 mb-2">
            "{datos?.lista?.nombre}"
          </p>
          <p className="text-surface-400 text-sm mb-8">
            Rol: <span className="font-medium text-surface-600">{datos?.rol === 'EDITOR' ? 'Editor' : 'Visor'}</span>
          </p>

          <button
            onClick={() => aceptarMutation.mutate()}
            disabled={aceptarMutation.isLoading}
            className="btn-primary w-full py-3.5 flex items-center justify-center gap-2"
          >
            {aceptarMutation.isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Aceptando...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Aceptar invitación
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
