const TextArea = ({name, onChange, placeholder, value, className}) => {
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