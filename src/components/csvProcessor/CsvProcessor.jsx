import { useState } from "react";
import { Notice, Status } from "../ui/ui";

const ROW_STATUS = {
    ok: { label: "Válido", tone: "ok" },
    invalid: { label: "Id inválido", tone: "danger" },
    duplicate: { label: "Duplicado, se omite", tone: "warn" },
};

const PREVIEW_LIMIT = 200;

const FileIcon = ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
        <path d="M14 3v5h5M8.5 13h7M8.5 16.5h7" />
    </svg>
);

/**
 * Carga de CSV con ids de solicitudes + vista previa validada.
 * El archivo se lee automáticamente al seleccionarlo (ver utils/parseRequestCsv).
 * También acepta arrastrar y soltar.
 */
const CsvProcessor = ({
    fileInputId = "file-upload",
    file,
    parsed, // { rows, ids, invalidCount, duplicateCount } | null
    onFileChange,
    onClear,
}) => {
    const [dragging, setDragging] = useState(false);
    const [onlyProblems, setOnlyProblems] = useState(false);

    const onDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const f = e.dataTransfer.files?.[0];
        if (f) onFileChange({ target: { files: [f] } });
    };

    const problems = parsed ? parsed.invalidCount + parsed.duplicateCount : 0;
    const rows = parsed
        ? (onlyProblems ? parsed.rows.filter((r) => r.status !== "ok") : parsed.rows).slice(0, PREVIEW_LIMIT)
        : [];

    if (!file) {
        return (
            <label
                htmlFor={fileInputId}
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                className={`group flex flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-9 text-center transition-all duration-200 ${
                    dragging
                        ? "scale-[1.01] border-teal bg-teal-soft"
                        : "border-teal/40 bg-teal-soft/50 hover:border-teal hover:bg-teal-soft"
                }`}
            >
                <span
                    className={`mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-teal/15 text-teal transition-transform duration-200 ${
                        dragging ? "-translate-y-1" : "group-hover:-translate-y-0.5"
                    }`}
                >
                    <FileIcon />
                </span>
                <span className="text-sm text-ink">
                    {dragging ? (
                        "Soltá el archivo para cargarlo"
                    ) : (
                        <>
                            Arrastrá el archivo acá o <span className="font-medium text-teal underline">elegilo</span>
                        </>
                    )}
                </span>
                <span className="mt-1 text-xs text-muted">
                    CSV con una columna <code className="font-mono">id</code> (id de la solicitud en SUA)
                </span>
                <input
                    id={fileInputId}
                    type="file"
                    accept=".csv,text/csv"
                    onChange={onFileChange}
                    className="sr-only"
                />
            </label>
        );
    }

    return (
        <div className="space-y-3">
            <div className="anim-fade flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg border border-teal/40 bg-teal-soft/60 px-3 py-2.5 text-sm">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-teal/15 text-teal">
                    <FileIcon size={18} />
                </span>
                <span className="font-medium text-ink break-all">{file.name}</span>
                {parsed && (
                    <span className="text-muted tabular">
                        {parsed.ids.length} válidos
                        {parsed.duplicateCount > 0 && ` · ${parsed.duplicateCount} duplicados`}
                        {parsed.invalidCount > 0 && (
                            <span className="text-danger"> · {parsed.invalidCount} inválidos</span>
                        )}
                    </span>
                )}
                <button type="button" onClick={onClear} className="ml-auto text-sm font-medium text-teal hover:underline">
                    Cambiar archivo
                </button>
                <input id={fileInputId} type="file" accept=".csv,text/csv" onChange={onFileChange} className="sr-only" />
            </div>

            {parsed?.invalidCount > 0 && (
                <Notice>
                    Hay filas con un id que no es un número entero. Corregí el archivo y volvé a cargarlo.
                </Notice>
            )}

            {parsed && (
                <>
                    {problems > 0 && (
                        <label className="flex w-fit items-center gap-2 text-sm text-muted">
                            <input
                                type="checkbox"
                                checked={onlyProblems}
                                onChange={(e) => setOnlyProblems(e.target.checked)}
                                className="h-4 w-4 accent-accent"
                            />
                            Mostrar solo filas con problemas
                        </label>
                    )}
                    <div className="max-h-72 overflow-auto rounded-md border border-line">
                        <table className="min-w-full border-collapse text-sm">
                            <thead className="sticky top-0 bg-subtle">
                                <tr>
                                    <th className="w-16 border-b border-line px-3 py-1.5 text-right text-sm font-medium text-muted">
                                        Fila
                                    </th>
                                    <th className="border-b border-line px-3 py-1.5 text-left text-sm font-medium text-muted">
                                        Id solicitud
                                    </th>
                                    <th className="border-b border-line px-3 py-1.5 text-left text-sm font-medium text-muted">
                                        Estado
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row) => (
                                    <tr key={row.line} className="border-b border-line last:border-b-0">
                                        <td className="px-3 py-1 text-right text-faint tabular">{row.line}</td>
                                        <td className="px-3 py-1 font-mono">
                                            {row.id || <span className="font-sans italic text-faint">vacío</span>}
                                        </td>
                                        <td className="px-3 py-1">
                                            <Status tone={ROW_STATUS[row.status].tone}>{ROW_STATUS[row.status].label}</Status>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {(onlyProblems ? problems : parsed.rows.length) > PREVIEW_LIMIT && (
                        <p className="text-xs text-muted">Se muestran las primeras {PREVIEW_LIMIT} filas.</p>
                    )}
                </>
            )}
        </div>
    );
};

export default CsvProcessor;
