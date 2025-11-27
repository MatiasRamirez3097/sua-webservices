import { Link } from "react-router-dom";
import Logo from "../../assets/Municipalidad_sin_fondo.png";
import { Button, RoleGuard } from "../";

const Navbar = ({
    toggleLogin,
    logout,
    className = "bg-gray-800 text-white top-0 left-0 w-full shadow-md z-50",
    user,
}) => {
    return (
        <nav className={className}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-23">
                    <div className="flex items-center space-x-3">
                        <img
                            src={Logo}
                            className="h-22 w-auto object-contain"
                        />
                        <span className="font-semibold text-xl tracking-wide">
                            SUA Webservices
                        </span>
                    </div>
                    <div className="hidden md:flex items-center space-x-10">
                        <Link
                            to="/home"
                            className="hover:text-indigo-400 transition-colors"
                        >
                            Home
                        </Link>

                        <RoleGuard allowedRoles={["manager", "admin"]}>
                            <Link
                                to="/intervenciones"
                                className="hover:text-indigo-400 transition-colors"
                            >
                                Intervenciones
                            </Link>
                            <Link
                                to="/resoluciones"
                                className="hover:text-indigo-400 transition-colors"
                            >
                                Resoluciones
                            </Link>
                        </RoleGuard>

                        {Object.keys(user).length == 0 ? (
                            <Button
                                text="Iniciar sesion"
                                className="text-indigo-400"
                                onclick={toggleLogin}
                            ></Button>
                        ) : (
                            <Button
                                text="Cerrar sesion"
                                className="text-indigo-400"
                                onclick={logout}
                            ></Button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
