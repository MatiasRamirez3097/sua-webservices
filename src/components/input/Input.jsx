const Input = ({
    className = "w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y",
    name,
    type = "text",
    value,
    onChange,
}) => {
    return (
        <>
            <div>
                <input
                    type={type}
                    value={value}
                    className={className}
                    name={name}
                    onChange={onChange}
                />
            </div>
        </>
    );
};

export default Input;
