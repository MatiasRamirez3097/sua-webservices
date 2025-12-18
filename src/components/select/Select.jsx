const Select = ({ name, onChange, options, value, required }) => {
    return (
        <select
            name={name}
            onChange={onChange}
            value={value}
            className="w-full max-w-2xl mx-auto border border-gray-300 p-3 rounded- mb-6 font-semibold text-white text-md"
        >
            {options.map((item, i) => {
                return (
                    <option
                        key={i}
                        value={item.value}
                        className="bg-gray-800 border border-gray-300 font-semibold text-white text-md"
                    >
                        {item.text}
                    </option>
                );
            })}
        </select>
    );
};

export default Select;
