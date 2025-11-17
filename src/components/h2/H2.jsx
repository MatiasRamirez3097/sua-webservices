const H2 =({
    className="text-2xl font-bold text-white text-center mb-6", 
    label
}) => {
    return (    
        <h2 className={className}>
            {label}
        </h2>
    );
};

export default H2;