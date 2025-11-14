const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-8 fixed bottom-0 left-0 w-full shadow-inner">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
                <div className="flex flex-col space-y-1 sm:space-y-0 sm:items-start">
                    <p className="text-sm">&copy; 2025 SUA Website. Todos los derechos reservados.</p>
                    <p className="text-xs">Direccion General de Parques y Paseos.</p>
                </div>
                <div className="flex space-x-4 mt-4 sm:mt-0">
                    <a href="#" className="hover:text-gray-400">Acerca</a>
                    <a href="#" className="hover:text-gray-400">Agenda</a>
                    <a href="#" className="hover:text-gray-400">Contacto</a>
                </div>
            </div>
        </footer>
    )
}

export default Footer;