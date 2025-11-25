const Navbar = ({ 
    children,
    className="bg-gray-800 text-white top-0 left-0 w-full shadow-md z-50", 
}) => {
    return (
        <nav className={className}>
            {children}
        </nav>
    );
};

export default Navbar;
