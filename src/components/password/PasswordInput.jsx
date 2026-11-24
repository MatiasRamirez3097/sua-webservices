import { useId, useState } from "react";
import { FIELD_CLASS } from "../ui/styles";

const EyeIcon = ({ visible }) => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
    >
        {visible ? (
            <>
                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                <line x1="1" y1="1" x2="23" y2="23" />
            </>
        ) : (
            <>
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
            </>
        )}
    </svg>
);

/**
 * Input de contraseña con botón para mostrar/ocultar.
 * `invalid` pinta el borde en rojo; `hint` muestra un texto debajo.
 */
const PasswordInput = ({
    label,
    value,
    onChange,
    name,
    placeholder = "",
    autoComplete = "current-password",
    invalid = false,
    hint,
    autoFocus = false,
}) => {
    const [visible, setVisible] = useState(false);
    const id = useId();

    return (
        <div className="flex flex-col gap-1">
            {label && (
                <label htmlFor={id} className="text-sm font-medium text-ink">
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    id={id}
                    name={name}
                    type={visible ? "text" : "password"}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    autoFocus={autoFocus}
                    aria-invalid={invalid || undefined}
                    className={`${FIELD_CLASS} pr-10 ${invalid ? "!border-danger focus:!ring-danger" : ""}`}
                />
                <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setVisible((v) => !v)}
                    aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
                    title={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded p-1.5 text-faint hover:bg-subtle hover:text-ink"
                >
                    <EyeIcon visible={visible} />
                </button>
            </div>
            {hint && <p className="text-xs text-danger">{hint}</p>}
        </div>
    );
};

export default PasswordInput;
