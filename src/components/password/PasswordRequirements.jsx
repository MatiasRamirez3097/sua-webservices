import { checkPassword } from "../../utils/passwordPolicy";

/** Lista en vivo de los requisitos de la contraseña. */
const PasswordRequirements = ({ password = "" }) => {
    const rules = checkPassword(password);
    return (
        <ul className="grid grid-cols-1 gap-x-4 gap-y-0.5 sm:grid-cols-2" aria-label="Requisitos de la contraseña">
            {rules.map((r) => (
                <li key={r.id} className={`flex items-center gap-1.5 text-xs ${r.ok ? "text-ok" : "text-muted"}`}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                        {r.ok ? <polyline points="20 6 9 17 4 12" /> : <circle cx="12" cy="12" r="3" />}
                    </svg>
                    <span>{r.label}</span>
                    <span className="sr-only">{r.ok ? "(cumplido)" : "(pendiente)"}</span>
                </li>
            ))}
        </ul>
    );
};

export default PasswordRequirements;
