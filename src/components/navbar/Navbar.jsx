import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Logo from "../../assets/Municipalidad_sin_fondo.png";
import { RoleGuard } from "../";
import { sweetAlert } from "../alerts/SweetAlert";
import { server } from "../../Api";
import { ls } from "../../utils/ls";

// ─── Avatar con iniciales ─────────────────────────────────────────────────────
const Avatar = ({ user, size = "w-9 h-9", text = "text-sm" }) => {
    const initials =
        `${user?.name?.[0] || ""}${user?.surname?.[0] || ""}`.toUpperCase();
    return (
        <div
            className={`${size} rounded-full bg-indigo-600 flex items-center justify-center text-white ${text} font-bold select-none shrink-0`}
        >
            {initials || "U"}
        </div>
    );
};

const EyeIcon = ({ show }) => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
    >
        {show ? (
            // ✅ Contraseña VISIBLE → mostrar ojo tachado (para ocultar)
            <>
                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                <line x1="1" y1="1" x2="23" y2="23" />
            </>
        ) : (
            // ✅ Contraseña OCULTA → mostrar ojo normal (para ver)
            <>
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
            </>
        )}
    </svg>
);

const PasswordField = ({ label, value, show, onToggle, onChange }) => (
    <div className="flex flex-col gap-1">
        <label className="text-gray-400 text-xs font-medium">{label}</label>
        <div className="relative">
            <input
                type={show ? "text" : "password"}
                value={value}
                onChange={onChange}
                placeholder="••••••••"
                className="w-full bg-gray-800 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
            <button
                type="button"
                onClick={onToggle}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
            >
                <EyeIcon show={show} />
            </button>
        </div>
    </div>
);

// ─── Modal cambio de contraseña ───────────────────────────────────────────────
const ModalCambiarPassword = ({ onClose }) => {
    const [form, setForm] = useState({ current: "", new: "", confirm: "" });
    const [loading, setLoading] = useState(false);
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleSubmit = async () => {
        if (!form.current || !form.new || !form.confirm) {
            return sweetAlert.fire({
                type: "warning",
                title: "Campos incompletos",
                message: "Completá todos los campos.",
            });
        }
        if (form.new.length < 6) {
            return sweetAlert.fire({
                type: "warning",
                title: "Contraseña inválida",
                message:
                    "La nueva contraseña debe tener al menos 6 caracteres.",
            });
        }
        if (form.new !== form.confirm) {
            return sweetAlert.fire({
                type: "warning",
                title: "No coinciden",
                message: "La nueva contraseña y la confirmación no coinciden.",
            });
        }

        setLoading(true);
        try {
            const token = ls.getText("token");
            const res = await server.put(
                "/users/changepassword",
                {
                    currentPassword: form.current,
                    newPassword: form.new,
                },
                {
                    headers: { Authorization: "Bearer " + token },
                },
            );

            if (res.data.success) {
                sweetAlert.fire({
                    type: "success",
                    title: "Contraseña actualizada",
                    message: "Tu contraseña fue cambiada correctamente.",
                });
                onClose();
            } else {
                sweetAlert.fire({
                    type: "error",
                    title: "Error",
                    message:
                        res.data.error || "No se pudo cambiar la contraseña.",
                });
            }
        } catch (err) {
            sweetAlert.fire({
                type: "error",
                title: "Error",
                message:
                    err.response?.data?.error || "Ocurrió un error inesperado.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
            <div className="bg-gray-900 w-full max-w-sm rounded-2xl border border-gray-700 shadow-2xl p-6">
                <div className="flex justify-between items-center border-b border-gray-700 pb-4 mb-5">
                    <div>
                        <h2 className="text-white font-semibold text-base">
                            Cambiar contraseña
                        </h2>
                        <p className="text-gray-500 text-xs mt-0.5">
                            Ingresá tu contraseña actual y la nueva
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-white text-xl transition-colors"
                    >
                        ✕
                    </button>
                </div>

                <div className="space-y-4">
                    <PasswordField
                        label="Contraseña actual"
                        value={form.current}
                        show={showCurrent}
                        onToggle={() => setShowCurrent(!showCurrent)}
                        onChange={(e) =>
                            setForm({ ...form, current: e.target.value })
                        }
                    />
                    <PasswordField
                        label="Nueva contraseña"
                        value={form.new}
                        show={showNew}
                        onToggle={() => setShowNew(!showNew)}
                        onChange={(e) =>
                            setForm({ ...form, new: e.target.value })
                        }
                    />
                    <PasswordField
                        label="Confirmar nueva contraseña"
                        value={form.confirm}
                        show={showConfirm}
                        onToggle={() => setShowConfirm(!showConfirm)}
                        onChange={(e) =>
                            setForm({ ...form, confirm: e.target.value })
                        }
                    />
                </div>

                <div className="flex gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 transition-all text-sm"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Guardando..." : "Guardar"}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Componente principal ─────────────────────────────────────────────────────
const Navbar = ({
    toggleLogin,
    logout,
    className = "bg-[#151D30]/90 backdrop-blur-md border-b border-gray-800 text-white sticky top-0 left-0 w-full z-50",
    user = {},
}) => {
    const location = useLocation();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [modalPassword, setModalPassword] = useState(false);
    const dropdownRef = useRef(null);

    const hasUser = user && Object.keys(user).length > 0;

    const linkClass = (path) => `
        text-base font-semibold tracking-wide transition-all duration-200 py-2 border-b-2 whitespace-nowrap
        ${
            location.pathname === path
                ? "text-indigo-400 border-indigo-500"
                : "text-gray-300 border-transparent hover:text-white hover:border-gray-600"
        }
    `;

    useEffect(() => {
        const handleClick = (e) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target)
            ) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const rolLabel =
        {
            admin: "Administrador",
            fiscalizado: "Fiscalizado",
        }[user?.role] || null;

    return (
        <>
            <nav className={className}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Usamos justify-between para separar el Logo de los Links de forma natural */}
                    <div className="flex items-center justify-between h-24 gap-4">
                        {/* BRAND / LOGO (Izquierda) - El shrink-0 evita que se encimen elementos aquí */}
                        <Link
                            to="/home"
                            className="flex items-center gap-4 group shrink-0"
                        >
                            <img
                                src={Logo}
                                alt="Municipalidad de Rosario"
                                className="h-16 w-auto object-contain transition-transform group-hover:scale-102"
                            />
                            <span className="font-extrabold text-xl lg:text-2xl tracking-wide bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent whitespace-nowrap">
                                SUA Webservices
                            </span>
                        </Link>

                        {/* BLOQUE DERECHO (Links de navegación + Separador + Usuario) */}
                        <div className="hidden md:flex items-center gap-4 lg:gap-6 text-right">
                            {/* LINKS DE NAVEGACIÓN */}
                            <div className="flex items-center gap-4 lg:gap-6">
                                <Link to="/home" className={linkClass("/home")}>
                                    Home
                                </Link>

                                <RoleGuard module="rodados">
                                    <Link
                                        to="/rodados"
                                        className={linkClass("/rodados")}
                                    >
                                        Rodados
                                    </Link>
                                </RoleGuard>

                                <RoleGuard module="estadocargas">
                                    <Link
                                        to="/estadocargas"
                                        className={linkClass("/estadocargas")}
                                    >
                                        Estado de cargas
                                    </Link>
                                </RoleGuard>

                                <RoleGuard module="gestionsua">
                                    <Link
                                        to="/gestionSua"
                                        className={linkClass("/gestionSua")}
                                    >
                                        Gestión SUA
                                    </Link>
                                </RoleGuard>

                                {user?.role === "admin" && (
                                    <Link
                                        to="/usuarios"
                                        className={linkClass("/usuarios")}
                                    >
                                        Usuarios
                                    </Link>
                                )}
                            </div>

                            {/* SEPARADOR VISUAL */}
                            <span
                                className="h-6 w-px bg-gray-700 shrink-0"
                                aria-hidden="true"
                            />

                            {/* SECCIÓN DE USUARIO / LOGIN */}
                            <div className="shrink-0">
                                {hasUser ? (
                                    <div className="relative" ref={dropdownRef}>
                                        <button
                                            onClick={() =>
                                                setDropdownOpen(!dropdownOpen)
                                            }
                                            className="flex items-center gap-3 px-4 py-2 rounded-xl border border-gray-700/60 bg-gray-800/30 hover:bg-white/5 transition-colors"
                                        >
                                            <Avatar user={user} />
                                            <div className="text-left hidden lg:block max-w-[180px]">
                                                <p className="text-white text-sm font-semibold leading-tight truncate">
                                                    {user?.name} {user?.surname}
                                                </p>
                                                <p className="text-gray-500 text-xs leading-tight truncate">
                                                    {user?.area ||
                                                        rolLabel ||
                                                        "Sin área"}
                                                </p>
                                            </div>
                                            <svg
                                                width="12"
                                                height="12"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2.5"
                                                className={`text-gray-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                                            >
                                                <polyline points="6 9 12 15 18 9" />
                                            </svg>
                                        </button>

                                        {/* DROPDOWN MENU */}
                                        {dropdownOpen && (
                                            <div className="absolute right-0 top-full mt-2 w-64 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden z-50">
                                                <div className="px-5 py-4 border-b border-gray-700 flex items-center gap-3">
                                                    <Avatar
                                                        user={user}
                                                        size="w-10 h-10"
                                                        text="text-base"
                                                    />
                                                    <div className="min-w-0">
                                                        <p className="text-white font-semibold text-sm truncate">
                                                            {user?.name}{" "}
                                                            {user?.surname}
                                                        </p>
                                                        <p className="text-gray-400 text-xs truncate">
                                                            {user?.email}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="px-5 py-3 space-y-2 border-b border-gray-700">
                                                    {user?.area && (
                                                        <div className="flex justify-between items-center gap-2">
                                                            <span className="text-gray-500 text-xs shrink-0">
                                                                Área
                                                            </span>
                                                            <span className="text-gray-300 text-xs font-medium truncate">
                                                                {user.area}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="py-1">
                                                    <button
                                                        onClick={() => {
                                                            setDropdownOpen(
                                                                false,
                                                            );
                                                            setModalPassword(
                                                                true,
                                                            );
                                                        }}
                                                        className="w-full flex items-center gap-3 px-5 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors text-sm"
                                                    >
                                                        <svg
                                                            width="15"
                                                            height="15"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                        >
                                                            <rect
                                                                x="3"
                                                                y="11"
                                                                width="18"
                                                                height="11"
                                                                rx="2"
                                                                ry="2"
                                                            />
                                                            <path d="M7 11V7a5 5 0 0110 0v4" />
                                                        </svg>
                                                        Cambiar contraseña
                                                    </button>

                                                    <button
                                                        onClick={() => {
                                                            setDropdownOpen(
                                                                false,
                                                            );
                                                            logout();
                                                        }}
                                                        className="w-full flex items-center gap-3 px-5 py-3 text-red-400 hover:bg-gray-800 hover:text-red-300 transition-colors text-sm"
                                                    >
                                                        <svg
                                                            width="15"
                                                            height="15"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                        >
                                                            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                                                            <polyline points="16 17 21 12 16 7" />
                                                            <line
                                                                x1="21"
                                                                y1="12"
                                                                x2="9"
                                                                y2="12"
                                                            />
                                                        </svg>
                                                        Cerrar sesión
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <button
                                        onClick={toggleLogin}
                                        className="text-base font-bold bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-600/25"
                                    >
                                        Iniciar sesión
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* MODAL CAMBIAR CONTRASEÑA */}
            {modalPassword && (
                <ModalCambiarPassword onClose={() => setModalPassword(false)} />
            )}
        </>
    );
};

export default Navbar;
