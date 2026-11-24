import { useState } from "react";
import PasswordInput from "./PasswordInput";
import PasswordRequirements from "./PasswordRequirements";
import { Button, Dialog, Notice } from "../ui/ui";
import { generatePassword, isPasswordValid } from "../../utils/passwordPolicy";

/**
 * Modal para definir una contraseña nueva respetando la política.
 * - requireCurrent: pide además la contraseña actual (cambio propio).
 * - allowGenerate: muestra el botón "Generar" (blanqueo por un administrador).
 * - onSubmit({ current, password }) debe devolver una promesa; si rechaza con
 *   un Error, su mensaje se muestra dentro del modal.
 */
const PasswordFormModal = ({
    title,
    subtitle,
    requireCurrent = false,
    allowGenerate = false,
    submitText = "Guardar",
    onSubmit,
    onClose,
}) => {
    const [current, setCurrent] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [generated, setGenerated] = useState(false);
    const [copied, setCopied] = useState(false);

    const valid = isPasswordValid(password);
    const matches = password.length > 0 && password === confirm;
    const canSubmit = valid && matches && (!requireCurrent || current.length > 0) && !loading;

    const handleGenerate = () => {
        const p = generatePassword(12);
        setPassword(p);
        setConfirm(p);
        setGenerated(true);
        setCopied(false);
        setError("");
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(password);
            setCopied(true);
        } catch {
            setCopied(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!canSubmit) return;
        setLoading(true);
        setError("");
        try {
            await onSubmit({ current, password });
        } catch (err) {
            setError(err?.message || "No se pudo guardar la contraseña.");
            setLoading(false);
        }
    };

    return (
        <Dialog
            as="form"
            onSubmit={handleSubmit}
            title={title}
            description={subtitle}
            onClose={onClose}
            busy={loading}
            footer={
                <>
                    <Button onClick={onClose} disabled={loading}>
                        Cancelar
                    </Button>
                    <Button type="submit" variant="primary" disabled={!canSubmit} loading={loading}>
                        {submitText}
                    </Button>
                </>
            }
        >
            <div className="space-y-4">
                {requireCurrent && (
                    <PasswordInput
                        label="Contraseña actual"
                        value={current}
                        onChange={(e) => setCurrent(e.target.value)}
                        autoComplete="current-password"
                        autoFocus
                    />
                )}

                <div className="space-y-2">
                    <div className="flex items-end gap-2">
                        <div className="flex-1">
                            <PasswordInput
                                label="Nueva contraseña"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setGenerated(false);
                                }}
                                autoComplete="new-password"
                                autoFocus={!requireCurrent}
                            />
                        </div>
                        {allowGenerate && (
                            <Button onClick={handleGenerate} title="Generar una contraseña segura">
                                Generar
                            </Button>
                        )}
                    </div>

                    {generated && (
                        <div className="flex items-center justify-between gap-2 rounded-md border border-line bg-subtle px-3 py-2">
                            <code className="break-all font-mono text-sm text-ink">{password}</code>
                            <button
                                type="button"
                                onClick={handleCopy}
                                className="shrink-0 text-sm font-medium text-accent hover:underline"
                            >
                                {copied ? "Copiada" : "Copiar"}
                            </button>
                        </div>
                    )}

                    <PasswordRequirements password={password} />
                </div>

                <PasswordInput
                    label="Confirmar nueva contraseña"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    autoComplete="new-password"
                    invalid={confirm.length > 0 && !matches}
                    hint={confirm.length > 0 && !matches ? "Las contraseñas no coinciden." : null}
                />

                {error && <Notice>{error}</Notice>}
            </div>
        </Dialog>
    );
};

export default PasswordFormModal;
