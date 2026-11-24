import { FIELD_CLASS } from "../ui/styles";

const Input = ({ className = FIELD_CLASS, name, type = "text", value, onChange, ...rest }) => (
    <input
        type={type}
        value={value ?? ""}
        className={className}
        name={name}
        onChange={onChange}
        {...rest}
    />
);

export default Input;
