import Logo from "../../assets/Municipalidad.jpg"

const Navbar = () => {
    return (
        <nav className="bg-gray-800 text-white fixed top-0 left-0 w-full shadow-md z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-23">
                    <div className="flex items-center space-x-3">
                        <img
                            src={Logo}
                            className="h-22 w-auto object-contain"
                        />
                        <span className="font-semibold text-xl tracking-wide">SUA Website</span>
                    </div>
                    <div className="hidden md:flex items-center space-x-10">
                        <a href="#" className="hover:text-indigo-400 transition-colors">Inicio</a>
                        <a href="#" className="hover:text-indigo-400 transition-colors">Servicios</a>
                        <a href="#" className="hover:text-indigo-400 transition-colors">Contacto</a>
                        <a href="#" className="hover:text-indigo-400 transition-colors">Acerca</a>
                    </div>
                    <div className="md:hidden">
                        <button id="menu-boton" className="focus:outline-none">
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"    
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4 6h16M4 12h16M4 18h16" 
                            />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;