import { FIELD_CLASS } from "../ui/styles";

const Select = ({ name, onChange, options, value, id, disabled, className = "" }) => (
    <div className={`relative ${className}`}>
        <select
            id={id}
            name={name}
            onChange={onChange}
            value={value}
            disabled={disabled}
            className={`${FIELD_CLASS} appearance-none pr-9`}
        >
            {options.map((item, i) => (
                <option key={item.value ?? i} value={item.value}>
                    {item.text}
                </option>
            ))}
        </select>
        <svg
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            aria-hidden="true"
        >
            <polyline points="6 9 12 15 18 9" />
        </svg>
    </div>
);

export default Select;
