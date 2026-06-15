import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface-50 overflow-hidden">
      {/* Noise overlay */}
      <div className="noise-overlay" />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 glass">
        <div className="container mx-auto px-6 py-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-br from-brand-500 to-brand-700 rounded-2xl flex items-center justify-center shadow-glow">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
            <span className="font-display font-bold text-xl sm:text-2xl gradient-text">
              WeList
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-ghost whitespace-nowrap">
              Iniciar sesión
            </Link>
            <Link to="/registro" className="btn-primary">
              Registrarse
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-200/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-200/30 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-100/20 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6 relative">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-100/50 rounded-full mb-8 animate-fade-in">
              <span className="w-2 h-2 bg-brand-500 rounded-full animate-pulse-soft" />
              <span className="text-sm font-medium text-brand-700">
                Colaboración en tiempo real
              </span>
            </div>

            {/* Title */}
            <h1 className="font-display text-5xl md:text-7xl font-bold text-surface-900 mb-6 text-balance animate-slide-up">
              Organiza tu vida{" "}
              <span className="gradient-text">en conjunto</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-surface-500 mb-10 max-w-2xl mx-auto text-balance animate-slide-up stagger-1">
              Crea listas colaborativas, comparte con quien quieras y ve los
              cambios al instante. La forma más simple de organizar lo que
              importa.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up stagger-2">
              <Link to="/registro" className="btn-primary text-lg px-8 py-4">
                Empezar gratis
                <svg
                  className="w-5 h-5 ml-2 inline-block"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
              <Link to="/login" className="btn-secondary text-lg px-8 py-4">
                Ya tengo cuenta
              </Link>
            </div>

            {/* Social proof */}
            <div className="mt-12 animate-fade-in stagger-3">
              <p className="text-surface-400 text-sm italic max-w-md mx-auto">
                "La mejor herramienta para organizar a mi equipo. No sabía que
                necesitaba esto hasta que lo probé."
              </p>
            </div>
          </div>

          {/* Hero visual */}
          <div className="mt-16 lg:mt-24 relative max-w-5xl mx-auto animate-slide-up stagger-4">
            <div className="relative rounded-3xl overflow-hidden shadow-elevated bg-white p-2">
              <div className="rounded-2xl bg-surface-100 p-6">
                {/* Mock app interface */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <div className="ml-4 flex-1 h-8 bg-white rounded-lg flex items-center px-3">
                    <span className="text-xs text-surface-400">
                      welist.app/dashboard
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1 space-y-3">
                    {["Mis listas", "Compras", "Viajes"].map((item, i) => (
                      <div
                        key={item}
                        className={`p-3 rounded-xl text-sm font-medium ${
                          i === 0
                            ? "bg-brand-600 text-white"
                            : "bg-white text-surface-600 hover:bg-surface-50"
                        }`}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                  <div className="col-span-2 bg-white rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-surface-800">
                        Lista de compras
                      </h4>
                      <span className="badge">3 personas</span>
                    </div>
                    {["Leche", "Pan", "Huevos", "Frutas"].map((item, i) => (
                      <div
                        key={item}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-50"
                      >
                        <div
                          className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center ${
                            i < 2
                              ? "bg-brand-500 border-brand-500"
                              : "border-surface-300"
                          }`}
                        >
                          {i < 2 && (
                            <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
                        <span
                          className={`text-sm ${i < 2 ? "text-surface-400 line-through" : "text-surface-700"}`}
                        >
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* Floating elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-accent-100 rounded-2xl rotate-12 animate-float" />
            <div
              className="absolute -bottom-6 -left-6 w-20 h-20 bg-brand-100 rounded-2xl -rotate-12 animate-float"
              style={{ animationDelay: "1s" }}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="badge mb-4 inline-flex">Características</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-surface-900 mb-4">
              Todo lo que necesitas,{" "}
              <span className="gradient-text">nada que no</span>
            </h2>
            <p className="text-surface-500 max-w-2xl mx-auto">
              Diseñado para ser simple pero potente. Sin funcionalidades
              innecesarias, solo lo que realmente necesitas para organizarte.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card group">
              <div className="w-14 h-14 bg-brand-100 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-brand-200 transition-colors">
                <svg
                  className="w-7 h-7 text-brand-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="font-display text-xl font-semibold text-surface-800 mb-2">
                Colaborativo
              </h3>
              <p className="text-surface-500">
                Crea listas y compártelas con quien quieras. Amigos, familia o
                equipo de trabajo, todos al mismo nivel.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card group">
              <div className="w-14 h-14 bg-accent-100 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-accent-200 transition-colors">
                <svg
                  className="w-7 h-7 text-accent-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="font-display text-xl font-semibold text-surface-800 mb-2">
                Tiempo real
              </h3>
              <p className="text-surface-500">
                Los cambios se sincronizan al instante. Cuando alguien marca un
                elemento, todos lo ven inmediatamente.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card group">
              <div className="w-14 h-14 bg-brand-100 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-brand-200 transition-colors">
                <svg
                  className="w-7 h-7 text-brand-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="font-display text-xl font-semibold text-surface-800 mb-2">
                Simple y rápido
              </h3>
              <p className="text-surface-500">
                Interfaz limpia y fácil de usar. Sin complicaciones, sin curva
                de aprendizaje. Solo abre y usa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 lg:py-32 bg-white relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="badge mb-4 inline-flex">Cómo funciona</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-surface-900 mb-4">
              Tres pasos para <span className="gradient-text">empezar</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "01",
                title: "Crea tu cuenta",
                desc: "Regístrate gratis en segundos. Sin tarjetas, sin compromisos.",
              },
              {
                step: "02",
                title: "Crea una lista",
                desc: "Dale un nombre, invita a quien quieras y empieza a añadir elementos.",
              },
              {
                step: "03",
                title: "Organiza junto",
                desc: "Marca elementos, ve cambios en tiempo real y mantente sincronizado.",
              },
            ].map((item, i) => (
              <div key={item.step} className="text-center relative">
                <div className="font-display text-6xl font-bold text-brand-100 mb-4">
                  {item.step}
                </div>
                <h3 className="font-display text-xl font-semibold text-surface-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-surface-500">{item.desc}</p>
                {i < 2 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px bg-gradient-to-r from-brand-200 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent-400 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-6 text-balance">
              ¿Listo para organizarte de verdad?
            </h2>
            <p className="text-brand-100 text-lg mb-10 max-w-xl mx-auto">
              Empieza a organizar tu vida hoy. Es gratis, rápido y sin
              complicaciones.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/registro"
                className="inline-flex items-center justify-center gap-2 bg-white text-brand-700 px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-brand-50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              >
                Crear mi primera lista
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-900 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-brand-400 to-brand-600 rounded-xl flex items-center justify-center shadow-glow">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <span className="font-display font-bold text-lg gradient-text">
                WeList
              </span>
            </div>
            <div className="flex items-center gap-8">
              <Link
                to="/login"
                className="text-surface-400 hover:text-white transition-colors text-sm"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/registro"
                className="text-surface-400 hover:text-white transition-colors text-sm"
              >
                Registrarse
              </Link>
            </div>
            <p className="text-surface-500 text-sm">
              © 2026 WeList. Organiza tu vida en conjunto.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
