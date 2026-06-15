import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  const { registro } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    setCargando(true);

    try {
      await registro({ nombre, email, password });
      toast.success('Cuenta creada exitosamente');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al crear cuenta');
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="min-h-screen lg:flex lg:items-center lg:justify-center">
      {/* Left panel - Visual */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent-400/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-400/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <span className="font-display font-semibold text-2xl text-white">WeList</span>
          </div>

          <div className="max-w-md space-y-6">
            <h2 className="text-2xl font-display font-bold text-white mb-8">
              Organiza tu vida en conjunto
            </h2>
            {[
              { icon: '✓', text: 'Crea listas ilimitadas' },
              { icon: '✓', text: 'Invita a quien quieras' },
              { icon: '✓', text: 'Sincronización en tiempo real' },
              { icon: '✓', text: 'Gratis para siempre' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-white/90 text-lg">{item.text}</span>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <p className="text-white/90 text-lg leading-relaxed">
              "Empecé a usarlo con mi familia y ahora no podemos vivir sin él. Todo tan simple como debe ser."
            </p>
            <p className="text-white/50 text-sm mt-3">— Lo que cualquier usuario diría</p>
          </div>
        </div>
      </div>

      {/* Right panel - Form */}
      <div className="h-screen lg:h-auto lg:min-h-0 flex-1 flex items-center justify-center p-6 sm:p-8 bg-surface-50 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-11 h-11 bg-gradient-to-br from-brand-500 to-brand-700 rounded-2xl flex items-center justify-center shadow-glow">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <span className="font-display font-bold text-xl gradient-text">WeList</span>
          </div>

          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-surface-900 mb-2">
              Crea tu cuenta
            </h1>
            <p className="text-surface-500">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-brand-600 hover:text-brand-700 font-medium transition-colors">
                Inicia sesión
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-surface-700 mb-2">
                Nombre
              </label>
              <input
                id="nombre"
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="input-field"
                placeholder="Tu nombre"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-surface-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-surface-700 mb-2">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
              />
              <p className="mt-1 text-xs text-surface-400">Mínimo 8 caracteres</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-surface-700 mb-2">
                Confirmar contraseña
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                required
                className="w-4 h-4 mt-0.5 rounded border-surface-300 text-brand-600 focus:ring-brand-500"
              />
              <span className="text-sm text-surface-600">
                Acepto los{' '}
                <button type="button" className="text-brand-600 hover:text-brand-700 font-medium">
                  términos y condiciones
                </button>{' '}
                y la{' '}
                <button type="button" className="text-brand-600 hover:text-brand-700 font-medium">
                  política de privacidad
                </button>
              </span>
            </div>

            <button
              type="submit"
              disabled={cargando}
              className="btn-primary w-full py-3.5"
            >
              {cargando ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creando cuenta...
                </span>
              ) : (
                'Crear cuenta'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
