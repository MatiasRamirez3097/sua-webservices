const Tooltip = ({ text, children }) => {
    return (
        <div className="relative group inline-flex">
            {children}

            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-700 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-50">
                {text}
            </div>
        </div>
    );
};

export default Tooltip;
