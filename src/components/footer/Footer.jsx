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

const Footer = () => {
    const anio = new Date().getFullYear();

    return (
        <footer className="bg-[#151D30] border-t border-gray-800 text-white mt-auto">
            {/* Aumentado el padding vertical a py-12 y alineación perfecta al max-w-7xl */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                    {/* ── COLUMNA IZQUIERDA — CIL ── */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                            {/* Logo CIL escalado a 48px */}
                            <LogoCIL size={48} />
                            <div>
                                <p className="text-white font-bold text-base tracking-wide leading-tight">
                                    Centro de Informática Local
                                </p>
                                <p className="text-gray-400 text-sm mt-0.5">
                                    Sistemas de Información
                                </p>
                            </div>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed max-w-md">
                            Sistema desarrollado y mantenido por el Centro de
                            Informática Local de la Dirección General de Parques
                            y Paseos.
                        </p>
                        <div className="flex items-center gap-2.5 mt-1">
                            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                            <span className="text-gray-400 text-sm font-medium">
                                SUA Webservices · Fase I · {anio}
                            </span>
                        </div>
                    </div>

                    {/* ── COLUMNA DERECHA — INSTITUCIÓN ── */}
                    <div className="flex flex-col gap-4 sm:items-end justify-between">
                        <div className="sm:text-right">
                            <p className="text-white font-bold text-base tracking-wide">
                                Municipalidad de Rosario
                            </p>
                            <p className="text-gray-400 text-sm mt-0.5">
                                Dirección General de Parques y Paseos
                            </p>
                        </div>
                        <div className="flex flex-col gap-1.5 sm:items-end">
                            <p className="text-gray-400 text-sm">
                                Rosario, Santa Fe, Argentina
                            </p>
                            <a
                                href="https://www.rosario.gob.ar"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors font-semibold"
                            >
                                rosario.gob.ar ↗
                            </a>
                        </div>
                        <p className="text-gray-500 text-xs sm:text-right mt-2">
                            &copy; {anio} Todos los derechos reservados.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};
export default Footer;
