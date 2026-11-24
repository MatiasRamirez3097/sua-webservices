import { useState, useRef, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setToken } from "../../redux/slices/auth/authSlice";
import Logo from "../../assets/Municipalidad_sin_fondo.png";
import PasswordFormModal from "../password/PasswordFormModal";
import { sweetAlert } from "../alerts/SweetAlert";
import { server } from "../../Api";
import { NAV_ITEMS, canSee } from "../../utils/access";

const ModalCambiarPassword = ({ onClose }) => {
    const dispatch = useDispatch();
    const handleSubmit = async ({ current, password }) => {
        try {
            const res = await server.put("/users/changepassword", {
                currentPassword: current,
                newPassword: password,
            });
            if (!res.data.success)
                throw new Error(res.data.error || "No se pudo cambiar la contraseña.");
            // Las sesiones anteriores quedan invalidadas; guardamos el token nuevo
            if (res.data.token) dispatch(setToken(res.data.token));
        } catch (err) {
            throw new Error(
                err.response?.data?.error || err.message || "Ocurrió un error inesperado.",
            );
        }
        onClose();
        sweetAlert.fire({ type: "success", title: "Contraseña actualizada" });
    };

    return (
        <PasswordFormModal
            title="Cambiar contraseña"
            subtitle="Ingresá tu contraseña actual y elegí una nueva."
            requireCurrent
            onSubmit={handleSubmit}
            onClose={onClose}
        />
    );
};

const Chevron = ({ open }) => (
    <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        aria-hidden="true"
        className={`text-night-muted transition-transform duration-150 ${open ? "rotate-180" : ""}`}
    >
        <polyline points="6 9 12 15 18 9" />
    </svg>
);

const Navbar = ({ logout, user = {} }) => {
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [modalPassword, setModalPassword] = useState(false);
    const menuRef = useRef(null);

    const items = NAV_ITEMS.filter((item) => canSee(user, item));

    useEffect(() => {
        setMobileOpen(false);
        setMenuOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        const onClick = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
        };
        const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
        document.addEventListener("mousedown", onClick);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onClick);
            document.removeEventListener("keydown", onKey);
        };
    }, []);

    const linkClass = ({ isActive }) =>
        `relative flex h-9 items-center rounded-md px-3 text-[15px] transition-colors ${
            isActive
                ? "bg-night-raised font-medium text-white after:absolute after:inset-x-3 after:-bottom-[15px] after:h-0.5 after:rounded-full after:bg-accent-bright"
                : "text-night-muted hover:bg-night-raised/60 hover:text-night-text"
        }`;

    const initials = `${user?.name?.[0] ?? ""}${user?.surname?.[0] ?? ""}`.toUpperCase() || "U";

    const fullName = `${user?.name ?? ""} ${user?.surname ?? ""}`.trim();

    return (
        <>
            <header className="border-b border-night-line bg-night text-night-text">
                <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 sm:px-6">
                    <Link to="/home" className="flex shrink-0 items-center gap-3">
                        {/* El PNG trae mucho margen transparente: lo compensamos con márgenes negativos */}
                        <img
                            src={Logo}
                            alt="Municipalidad de Rosario"
                            className="-mx-3 h-12 w-auto brightness-0 invert opacity-90"
                        />
                        <span className="h-6 w-px bg-night-line" aria-hidden="true" />
                        <span className="text-base font-semibold tracking-tight text-white">
                            SUA <span className="font-normal text-accent-bright">Webservices</span>
                        </span>
                    </Link>

                    <nav aria-label="Principal" className="hidden h-16 items-center gap-1 md:flex">
                        {items.map((item) => (
                            <NavLink key={item.to} to={item.to} className={linkClass}>
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>

                    <div className="relative ml-auto hidden md:block" ref={menuRef}>
                        <button
                            type="button"
                            onClick={() => setMenuOpen((o) => !o)}
                            aria-expanded={menuOpen}
                            aria-haspopup="menu"
                            className="flex items-center gap-2.5 rounded-md py-1 pl-1 pr-2 text-sm text-night-text hover:bg-night-raised"
                        >
                            <span
                                aria-hidden="true"
                                className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-semibold text-white"
                            >
                                {initials}
                            </span>
                            <span className="max-w-[200px] truncate">{fullName || user?.email}</span>
                            <Chevron open={menuOpen} />
                        </button>

                        {menuOpen && (
                            <div
                                role="menu"
                                className="absolute right-0 top-full z-50 mt-2 w-64 rounded-lg border border-line bg-surface py-1 text-left text-ink shadow-lg"
                            >
                                <div className="border-b border-line px-4 py-3">
                                    <p className="truncate text-sm font-medium text-ink">{fullName}</p>
                                    <p className="truncate text-sm text-muted">{user?.email}</p>
                                    {(user?.area || user?.isAdmin) && (
                                        <p className="mt-1 text-xs text-faint">
                                            {[user?.isAdmin && "Administrador", user?.area]
                                                .filter(Boolean)
                                                .join(" · ")}
                                        </p>
                                    )}
                                </div>
                                <button
                                    role="menuitem"
                                    type="button"
                                    onClick={() => {
                                        setMenuOpen(false);
                                        setModalPassword(true);
                                    }}
                                    className="block w-full px-4 py-2 text-left text-sm text-ink hover:bg-subtle"
                                >
                                    Cambiar contraseña
                                </button>
                                <button
                                    role="menuitem"
                                    type="button"
                                    onClick={logout}
                                    className="block w-full px-4 py-2 text-left text-sm text-danger hover:bg-danger-soft"
                                >
                                    Cerrar sesión
                                </button>
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => setMobileOpen((o) => !o)}
                        aria-expanded={mobileOpen}
                        aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
                        className="ml-auto rounded-md p-2 text-night-muted hover:bg-night-raised hover:text-white md:hidden"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                            {mobileOpen ? (
                                <path d="M18 6L6 18M6 6l12 12" />
                            ) : (
                                <path d="M3 6h18M3 12h18M3 18h18" />
                            )}
                        </svg>
                    </button>
                </div>

                {mobileOpen && (
                    <div className="border-t border-night-line px-4 py-3 text-left md:hidden">
                        <p className="px-2 text-sm font-medium text-white">{fullName}</p>
                        <p className="mb-2 px-2 text-sm text-night-muted">{user?.email}</p>
                        <nav aria-label="Principal" className="flex flex-col">
                            {items.map((item) => (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    className={({ isActive }) =>
                                        `rounded-md px-2 py-2 text-sm ${isActive ? "bg-night-raised font-medium text-white" : "text-night-muted hover:bg-night-raised hover:text-white"}`
                                    }
                                >
                                    {item.label}
                                </NavLink>
                            ))}
                        </nav>
                        <div className="mt-2 flex flex-col border-t border-night-line pt-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setMobileOpen(false);
                                    setModalPassword(true);
                                }}
                                className="rounded-md px-2 py-2 text-left text-sm text-night-muted hover:bg-night-raised hover:text-white"
                            >
                                Cambiar contraseña
                            </button>
                            <button
                                type="button"
                                onClick={logout}
                                className="rounded-md px-2 py-2 text-left text-sm text-[#ff9d94] hover:bg-night-raised"
                            >
                                Cerrar sesión
                            </button>
                        </div>
                    </div>
                )}
            </header>

            {modalPassword && <ModalCambiarPassword onClose={() => setModalPassword(false)} />}
        </>
    );
};

export default Navbar;
