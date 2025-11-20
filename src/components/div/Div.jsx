const Div = ({
    children,
    className = "w-full max-w-4xl mx-auto border border-gray-300 p-6 bg-gray-800 rounded-xl mb-8"
}) => {
    return(
        <div className={className}>
            {children}
        </div>
    );
};

export default Div;