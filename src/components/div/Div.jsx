const Div = ({
    className="w-full max-w-4xl mx-auto border border-gray-300 p-10 bg-gray-800 rounded-xl", 
    children
}) => {
    
    return(
        <div className={className}>
            {children}
        </div>
    );
};

export default Div;