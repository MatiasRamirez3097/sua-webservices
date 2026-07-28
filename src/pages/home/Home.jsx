import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

// ─── Slots de fotos — reemplazá las URLs por tus imágenes ────────────────────
// Podés usar rutas locales: import foto1 from "../../assets/fotos/foto1.jpg"
const FOTOS = [
    {
        id: 1,
        // src: fotoArbolado,  ← cuando tengas la foto, descomentá esto
        src: null,
        placeholder: "#2D4A3E",
        label: "Arbolado urbano",
    },
    {
        id: 2,
        src: null,
        placeholder: "#3A5F4A",
        label: "Espacios verdes",
    },
    {
        id: 3,
        src: null,
        placeholder: "#1E3A2F",
        label: "Vivero municipal",
    },
    {
        id: 4,
        src: null,
        placeholder: "#2A4838",
        label: "Mantenimiento de plazas",
    },
    {
        id: 5,
        src: null,
        placeholder: "#354F42",
        label: "Parques y Paseos",
    },
];

// ─── Logo CIL (SVG inline simple y limpio) ───────────────────────────────────
const LogoCIL = ({ size = 44 }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        {/* Fondo cuadrado redondeado exacto */}
        <rect width="48" height="48" rx="10" fill="#3B4FA8" />

        {/* C estilizada - Desplazada a la izquierda para dar equilibrio */}
        <path
            d="M26 15C23.5 13 20 12 16.5 13C11.5 14.5 8 19 8 23.5C8 28.5 12 33 17 34C20 34.5 23 33.5 25.5 32"
            stroke="white"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
        />

        {/* I - Centrada en el espacio derecho disponible */}
        <line
            x1="30"
            y1="14"
            x2="30"
            y2="34"
            stroke="white"
            strokeWidth="3.5"
            strokeLinecap="round"
        />

        {/* L - Ubicada proporcionalmente al final */}
        <line
            x1="36"
            y1="14"
            x2="36"
            y2="34"
            stroke="white"
            strokeWidth="3.5"
            strokeLinecap="round"
        />
        <line
            x1="36"
            y1="34"
            x2="41"
            y2="34"
            stroke="white"
            strokeWidth="3.5"
            strokeLinecap="round"
        />
    </svg>
);

// ─── Carrusel ─────────────────────────────────────────────────────────────────
const Carrusel = () => {
    const [current, setCurrent] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const intervalRef = useRef(null);

    const goTo = (index) => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrent(index);
            setIsTransitioning(false);
        }, 300);
    };

    const next = () => goTo((current + 1) % FOTOS.length);
    const prev = () => goTo((current - 1 + FOTOS.length) % FOTOS.length);

    useEffect(() => {
        intervalRef.current = setInterval(next, 5000);
        return () => clearInterval(intervalRef.current);
    }, [current]);

    const foto = FOTOS[current];

    return (
        <div className="relative w-full h-72 rounded-2xl overflow-hidden group">
            {/* Foto o placeholder */}
            <div
                className="w-full h-full transition-opacity duration-300"
                style={{
                    opacity: isTransitioning ? 0 : 1,
                    backgroundColor: foto.placeholder,
                }}
            >
                {foto.src ? (
                    <img
                        src={foto.src}
                        alt={foto.label}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                        {/* Ícono árbol placeholder */}
                        <svg
                            width="48"
                            height="48"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="rgba(255,255,255,0.3)"
                            strokeWidth="1.5"
                        >
                            <path d="M12 2L8 8H4l8 8-3 6h6l-3-6 8-8h-4L12 2z" />
                        </svg>
                        <span className="text-white/40 text-sm font-medium tracking-wide">
                            {foto.label}
                        </span>
                        <span className="text-white/25 text-xs">
                            Foto próximamente
                        </span>
                    </div>
                )}
            </div>

            {/* Gradiente inferior */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Label */}
            <div className="absolute bottom-4 left-5">
                <span className="text-white text-sm font-medium">
                    {foto.label}
                </span>
            </div>

            {/* Controles */}
            <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
            >
                ‹
            </button>
            <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
            >
                ›
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 right-5 flex gap-1.5">
                {FOTOS.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goTo(i)}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${
                            i === current ? "bg-white w-4" : "bg-white/40"
                        }`}
                    />
                ))}
            </div>
        </div>
    );
};

// ─── Acceso rápido ────────────────────────────────────────────────────────────
const AccesoRapido = ({ to, icon, label, description, color }) => (
    <Link
        to={to}
        className={`group flex flex-col gap-2 p-4 rounded-xl border border-gray-700 bg-gray-800/50 hover:bg-gray-800 hover:border-${color}-500/50 transition-all`}
    >
        <div
            className={`w-9 h-9 rounded-lg bg-${color}-900/40 flex items-center justify-center text-${color}-400 group-hover:scale-110 transition-transform`}
        >
            {icon}
        </div>
        <div>
            <p className="text-white text-sm font-semibold">{label}</p>
            <p className="text-gray-500 text-xs mt-0.5">{description}</p>
        </div>
    </Link>
);

// ─── Componente principal ─────────────────────────────────────────────────────
const Home = () => {
    const { user } = useSelector((store) => store.auth);

    const hora = new Date().getHours();
    const saludo =
        hora < 12
            ? "Buenos días"
            : hora < 19
              ? "Buenas tardes"
              : "Buenas noches";

    // Accesos según permisos
    const accesos = [
        user?.role === "admin" ||
        user?.permissions?.find((p) => p.module === "rodados")
            ? {
                  to: "/rodados",
                  label: "Rodados",
                  description: "Solicitudes y calendario de vehículos",
                  color: "indigo",
                  icon: (
                      <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                      >
                          <rect x="1" y="3" width="15" height="13" rx="2" />
                          <path d="M16 8h4l3 5v3h-7V8z" />
                          <circle cx="5.5" cy="18.5" r="2.5" />
                          <circle cx="18.5" cy="18.5" r="2.5" />
                      </svg>
                  ),
              }
            : null,
        user?.role === "admin" ||
        user?.permissions?.find((p) => p.module === "estadocargas")
            ? {
                  to: "/estadocargas",
                  label: "Estado de Cargas",
                  description: "Monitoreo de lotes procesados",
                  color: "green",
                  icon: (
                      <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                      >
                          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                      </svg>
                  ),
              }
            : null,
        user?.role === "admin" ||
        user?.permissions?.find((p) => p.module === "gestionsua")
            ? {
                  to: "/gestionsua",
                  label: "Gestión SUA",
                  description: "Resoluciones y derivaciones masivas",
                  color: "yellow",
                  icon: (
                      <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                      >
                          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                          <polyline points="10 9 9 9 8 9" />
                      </svg>
                  ),
              }
            : null,
        user?.role === "admin"
            ? {
                  to: "/usuarios",
                  label: "Usuarios",
                  description: "Gestión de accesos y permisos",
                  color: "red",
                  icon: (
                      <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                      >
                          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M23 21v-2a4 4 0 00-3-3.87" />
                          <path d="M16 3.13a4 4 0 010 7.75" />
                      </svg>
                  ),
              }
            : null,
    ].filter(Boolean);

    return (
        <div className="w-full max-w-5xl mx-auto space-y-8 pb-8">
            {/* ── SALUDO ── */}
            <div className="flex items-start justify-between">
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-x-2">
                    <span className="text-gray-400 text-lg font-medium">
                        {saludo},
                    </span>
                    <h2 className="text-3xl font-bold text-white mt-0.5 sm:mt-0">
                        {user?.name} {user?.surname}
                    </h2>
                    {user?.area && (
                        <p className="text-gray-400 text-sm font-medium mt-1.5">
                            {user.area}
                        </p>
                    )}
                </div>

                {/* Fecha */}
                <div className="text-right">
                    <p className="text-gray-400 text-sm">
                        {new Date().toLocaleDateString("es-AR", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        })}
                    </p>
                </div>
            </div>

            {/* ── GRID PRINCIPAL ── */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Carrusel — ocupa 3 columnas */}
                <div className="lg:col-span-3">
                    <Carrusel />
                </div>

                {/* Tarjeta institucional — ocupa 2 columnas */}
                <div className="lg:col-span-2 bg-gray-800/60 border border-gray-700 rounded-2xl p-6 flex flex-col">
                    {/* Logo CIL + nombre — centrado */}
                    <div className="flex flex-col items-center text-center gap-3 mb-5">
                        <LogoCIL size={44} />
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-widest">
                                Desarrollado por
                            </p>
                            <p className="text-white font-bold text-sm leading-tight mt-0.5">
                                Centro de Informática Local
                            </p>
                            <p className="text-gray-400 text-xs">
                                Parques y Paseos · Rosario
                            </p>
                        </div>
                    </div>

                    <div className="border-t border-gray-700 pt-4 space-y-3 flex-grow">
                        <p className="text-gray-300 text-sm leading-relaxed text-center">
                            <span className="text-white font-semibold">
                                SUA Webservices
                            </span>{" "}
                            es el sistema de gestión interna de la Dirección
                            General de Parques y Paseos de la Municipalidad de
                            Rosario.
                        </p>
                        <p className="text-gray-400 text-sm leading-relaxed text-center">
                            Centraliza las operaciones de rodados, el
                            procesamiento masivo de resoluciones y derivaciones,
                            y el seguimiento del estado de cargas.
                        </p>
                    </div>

                    {/* Footer de la tarjeta */}
                    <div className="mt-5 pt-4 border-t border-gray-700 flex items-center justify-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-gray-500 text-xs">
                            Sistema operativo · Fase I
                        </span>
                    </div>
                </div>
            </div>

            {/* ── ACCESOS RÁPIDOS ── */}
            {accesos.length > 0 && (
                <div>
                    <p className="text-gray-500 text-xs uppercase tracking-widest mb-3">
                        Accesos rápidos
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {accesos.map((acceso) => (
                            <AccesoRapido key={acceso.to} {...acceso} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
