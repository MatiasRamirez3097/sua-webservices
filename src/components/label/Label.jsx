const Label = ({
    label,
    className = "block text-xl font-semibold text-white text-center p-4",
}) => {
    return <label className={className}>{label}</label>;
};

export default Label;
