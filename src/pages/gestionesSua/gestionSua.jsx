import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { postBatches } from "../../redux/slices/sua/batchSlice";
import { CsvProcessor, Input, Select, TextArea } from "../../components";
import { Button, Field, Page, Tabs } from "../../components/ui/ui";
import { sweetAlert } from "../../components/alerts/SweetAlert";
import { parseRequestCsv } from "../../utils/parseRequestCsv";

const AREAS = [
    { value: 2098, text: "Parques y Paseos (2098)" },
    { value: 2115, text: "Parques y Paseos, futuras planificaciones (2115)" },
];
const OTHER_AREA = "other";
const LEGEND_MAX = 2000;

const TABS = [
    { id: "RESOLUCION", label: "Resolución" },
    { id: "DERIVACION", label: "Derivación" },
];

const nowLocal = () => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
};

/** Bloque del formulario: título a la izquierda, campos a la derecha. */
const FormRow = ({ title, help, children }) => (
    <div className="group/row relative grid gap-4 border-b border-line px-6 py-7 transition-colors last:border-b-0 focus-within:bg-accent-soft/30 md:grid-cols-[15rem_1fr] md:gap-10">
        <span
            aria-hidden="true"
            className="absolute inset-y-4 left-0 w-0.5 rounded-full bg-accent opacity-0 transition-opacity group-focus-within/row:opacity-100"
        />
        <div>
            <h2 className="text-sm font-semibold text-ink transition-colors group-focus-within/row:text-accent">{title}</h2>
            {help && <p className="mt-1 text-sm leading-relaxed text-muted">{help}</p>}
        </div>
        <div className="min-w-0 space-y-4">{children}</div>
    </div>
);

const AreaPicker = ({ id, label, value, onChange }) => {
    const isPreset = AREAS.some((a) => String(a.value) === String(value));
    const [custom, setCustom] = useState(!isPreset && value !== "");

    return (
        <Field label={label} htmlFor={id} required>
            <Select
                id={id}
                value={custom ? OTHER_AREA : value}
                onChange={(e) => {
                    const v = e.target.value;
                    setCustom(v === OTHER_AREA);
                    onChange(v === OTHER_AREA ? "" : v);
                }}
                options={[...AREAS, { value: OTHER_AREA, text: "Otra área (ingresar id)" }]}
            />
            {custom && (
                <Input
                    type="number"
                    min="1"
                    step="1"
                    placeholder="Id del área"
                    aria-label="Id del área"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="mt-2 block h-9 w-40 rounded-md border border-line-strong bg-surface px-3 text-sm text-ink focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
            )}
        </Field>
    );
};

const ProcessForm = ({ type }) => {
    const dispatch = useDispatch();
    const isResolution = type === "RESOLUCION";
    const fileInputId = `${type.toLowerCase()}-file-upload`;

    const [legend, setLegend] = useState("");
    const [resolutionDate, setResolutionDate] = useState("");
    const [executionDate, setExecutionDate] = useState("");
    const [area, setArea] = useState(String(AREAS[0].value));
    const [file, setFile] = useState(null);
    const [parsed, setParsed] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [done, setDone] = useState(false);

    const clearFile = () => {
        setFile(null);
        setParsed(null);
        const input = document.getElementById(fileInputId);
        if (input) input.value = "";
    };

    const handleFileChange = async (e) => {
        const f = e.target.files?.[0];
        if (!f) return;
        setDone(false);
        setFile(f);
        setParsed(null);
        try {
            setParsed(await parseRequestCsv(f));
        } catch (err) {
            clearFile();
            sweetAlert.fire({ type: "error", title: "No se pudo leer el archivo", message: err.message });
        }
    };

    const missing = [];
    if (!parsed?.ids.length) missing.push("archivo");
    if (!legend.trim()) missing.push(isResolution ? "solución" : "leyenda");
    if (!/^\d+$/.test(String(area)) || Number(area) <= 0) missing.push("área");
    if (isResolution && !resolutionDate) missing.push("fecha de resolución");
    if (!executionDate) missing.push("fecha de ejecución");
    const hasInvalid = (parsed?.invalidCount ?? 0) > 0;
    const totalSteps = isResolution ? 5 : 4;
    const count = parsed?.ids.length ?? 0;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (missing.length || hasInvalid) return;
        if (new Date(executionDate) < new Date())
            return sweetAlert.fire({
                type: "warning",
                title: "Fecha de ejecución vencida",
                message: "Elegí una fecha y hora futuras.",
            });

        const areaText = AREAS.find((a) => String(a.value) === String(area))?.text || `área ${area}`;
        const { isConfirmed } = await sweetAlert.fire({
            type: "question",
            title: isResolution ? "Agendar resolución" : "Agendar derivación",
            message: `Se van a ${isResolution ? "resolver" : "derivar"} <b>${count}</b> solicitudes ${
                isResolution ? "en" : "a"
            } <b>${areaText}</b> el ${new Date(executionDate).toLocaleString("es-AR")}.`,
            showCancelButton: true,
            confirmButtonText: "Agendar",
            cancelButtonText: "Volver",
        });
        if (!isConfirmed) return;

        setProcessing(true);
        try {
            await dispatch(
                postBatches({
                    type,
                    legend: legend.trim(),
                    scheduledFor: executionDate,
                    records: parsed.ids.map((id) => ({ id })),
                    ...(isResolution ? { idArea: area, resolutionDate } : { idAreaDerivada: area }),
                }),
            ).unwrap();
            setLegend("");
            setResolutionDate("");
            setExecutionDate("");
            clearFile();
            setDone(true);
        } catch (error) {
            sweetAlert.fire({
                type: "error",
                title: "No se pudo agendar",
                message: typeof error === "string" ? error : "Ocurrió un error.",
            });
        } finally {
            setProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} noValidate className="anim-rise overflow-hidden rounded-lg border border-line bg-surface shadow-[0_1px_2px_rgb(24_23_43/0.04)]">
            {done && (
                <div role="status" className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-ok-soft px-5 py-3 text-sm text-ok">
                    <span>Lote agendado.</span>
                    <Link to="/estadocargas" className="font-medium underline">
                        Ver en Estado de cargas
                    </Link>
                </div>
            )}

            <FormRow
                title="Solicitudes"
                help="Archivo CSV con los ids de las solicitudes. Los duplicados se envían una sola vez."
            >
                <CsvProcessor
                    fileInputId={fileInputId}
                    file={file}
                    parsed={parsed}
                    onFileChange={handleFileChange}
                    onClear={clearFile}
                />
            </FormRow>

            <FormRow
                title={isResolution ? "Solución" : "Leyenda"}
                help={
                    isResolution
                        ? "Texto con el que se resuelve cada solicitud."
                        : "Acompaña la derivación. Si la solicitud ya tiene una derivación vigente, se resuelve parcialmente con este texto y se vuelve a derivar."
                }
            >
                <TextArea
                    id={`${type}-legend`}
                    name="legend"
                    value={legend}
                    maxLength={LEGEND_MAX}
                    rows={5}
                    onChange={(e) => setLegend(e.target.value)}
                />
            </FormRow>

            <FormRow
                title={isResolution ? "Área y fechas" : "Destino y ejecución"}
                help="El lote se ejecuta en bloques de 15 minutos. Se puede cancelar o reprogramar hasta 15 minutos antes."
            >
                <AreaPicker
                    id={`${type}-area`}
                    label={isResolution ? "Área que resuelve" : "Área de destino"}
                    value={area}
                    onChange={setArea}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                    {isResolution && (
                        <Field label="Fecha de resolución" htmlFor={`${type}-resdate`} required hint="La que figura en SUA.">
                            <Input
                                id={`${type}-resdate`}
                                value={resolutionDate}
                                onChange={(e) => setResolutionDate(e.target.value)}
                                type="datetime-local"
                                step="1"
                            />
                        </Field>
                    )}
                    <Field label="Ejecución" htmlFor={`${type}-execdate`} required hint="Cuándo se envía a SUA.">
                        <Input
                            id={`${type}-execdate`}
                            value={executionDate}
                            min={nowLocal()}
                            onChange={(e) => setExecutionDate(e.target.value)}
                            type="datetime-local"
                        />
                    </Field>
                </div>
            </FormRow>

            <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2 border-t border-line bg-subtle px-6 py-4">
                <div className="mr-auto flex min-w-0 items-center gap-3">
                    <span className="h-1.5 w-28 shrink-0 overflow-hidden rounded-full bg-line" aria-hidden="true">
                        <span
                            className="block h-full rounded-full bg-accent transition-[width] duration-500 ease-out"
                            style={{ width: `${((totalSteps - missing.length) / totalSteps) * 100}%` }}
                        />
                    </span>
                    <p className="truncate text-sm text-muted">
                        {missing.length ? `Falta: ${missing.join(", ")}.` : "Listo para agendar."}
                    </p>
                </div>
                <Button
                    type="submit"
                    variant="primary"
                    disabled={missing.length > 0 || hasInvalid}
                    loading={processing}
                >
                    {isResolution ? "Agendar resolución" : "Agendar derivación"}
                    {count > 0 && ` de ${count} ${count === 1 ? "solicitud" : "solicitudes"}`}
                </Button>
            </div>
        </form>
    );
};

const GestionSua = () => {
    const [activeTab, setActiveTab] = useState("RESOLUCION");

    return (
        <Page
            title="Gestión SUA"
            description="Resolución o derivación masiva de solicitudes a partir de un CSV."
            hero={
                <Tabs
                    dark
                    label="Tipo de proceso"
                    value={activeTab}
                    onChange={setActiveTab}
                    tabs={TABS.map((t) => ({ value: t.id, label: t.label }))}
                />
            }
        >
            {/* key: cada pestaña mantiene su propio estado y se reinicia al cambiar */}
            <ProcessForm key={activeTab} type={activeTab} />
        </Page>
    );
};

export default GestionSua;
