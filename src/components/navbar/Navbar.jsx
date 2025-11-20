import { Link } from "react-router-dom";
import Logo from "../../assets/Municipalidad_sin_fondo.png";
import Button from "../button/Button";

const Navbar = ({ toggleLogin }) => {
    return (
        <nav className="bg-gray-800 text-white top-0 left-0 w-full shadow-md z-50">
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
                        <Button
                            text="Inicio de sesion"
                            className="text-indigo-400"
                            onclick={toggleLogin}
                        ></Button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
