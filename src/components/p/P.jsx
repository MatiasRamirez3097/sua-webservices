const P =({
    children,
    className="text-sm text-gray-300 italic"
})=>{
    return (
        <p className={className}>
            {children}
        </p>
    );
};

export default P