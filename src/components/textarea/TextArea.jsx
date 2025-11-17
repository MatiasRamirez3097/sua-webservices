const TextArea = ({
    name, 
    onChange, 
    placeholder, 
    value, 
    className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
}) => {
    return (
        <textarea
            name={name}
            onChange={onChange}
            value={value}
            rows={3}
            className={className}
            placeholder={placeholder}
        />
    );
};

export default TextArea;