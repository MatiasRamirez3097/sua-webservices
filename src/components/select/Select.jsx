const Select = ({ name, onChange, options, value }) => {
    return (
        <select name={name} onChange={onChange} value={value}>
            {options.map((item, i) => {
                return (
                    <option key={i} value={item.value}>
                        {item.text}
                    </option>
                );
            })}
        </select>
    );
};

export default Select;
