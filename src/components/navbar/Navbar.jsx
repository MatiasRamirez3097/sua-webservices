import { Link, useLocation } from "react-router-dom";
import Logo from "../../assets/Municipalidad_sin_fondo.png";
import { Button, RoleGuard } from "../";

const Navbar = ({
    toggleLogin,
    logout,
    className = "bg-[#151D30]/90 backdrop-blur-md border-b border-gray-800 text-white sticky top-0 left-0 w-full z-50",
    user = {},
}) => {
    const location = useLocation();

    const linkClass = (path) => `
        text-base font-semibold tracking-wide transition-all duration-200 py-2 border-b-2
        ${
            location.pathname === path
                ? "text-indigo-400 border-indigo-500"
                : "text-gray-300 border-transparent hover:text-white hover:border-gray-600"
        }
    `;

    const hasUser = user && Object.keys(user).length > 0;

    return (
        <nav className={className}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Altura de la barra en h-28 (112px) */}
                <div className="flex items-center h-28">
                    {/* LADO IZQUIERDO: Escudo y Nombre */}
                    <Link to="/home" className="flex items-center gap-5 group">
                        <img
                            src={Logo}
                            alt="Municipalidad de Rosario"
                            className="h-[88px] w-auto object-contain transition-transform group-hover:scale-103"
                        />
                        <span className="font-extrabold text-2xl tracking-wide bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent whitespace-nowrap">
                            SUA Webservices
                        </span>
                    </Link>

                    {/* 🚀 EL TRUCO MÁGICO: Este div empuja todo lo que viene después hacia la derecha */}
                    <div className="flex-grow" />

                    {/* LADO DERECHO: Enlaces de Navegación con un gap-8 cómodo */}
                    <div className="hidden md:flex items-center gap-8">
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

                        <span
                            className="h-6 w-px bg-gray-700"
                            aria-hidden="true"
                        />

                        {!hasUser ? (
                            <Button
                                text="Iniciar sesión"
                                className="text-base font-bold bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-600/25"
                                onClick={toggleLogin}
                            />
                        ) : (
                            <Button
                                text="Cerrar sesión"
                                className="text-base font-semibold text-gray-300 hover:text-red-400 transition-colors py-2"
                                onClick={logout}
                            />
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
