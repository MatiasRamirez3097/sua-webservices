import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Papa from "papaparse";
import {
    postBatches,
    setIdArea,
    setLegend,
    setExecutionDate,
    setResolutionDate,
} from "../../redux/slices/sua/batchSlice";
import { CsvProcessor, Input, Label, Select, TextArea } from "../../components";
import { sweetAlert } from "../../components/alerts/SweetAlert";

// ─── Constantes ───────────────────────────────────────────────────────────────
const AREAS = [
    { value: 2098, text: "Parques y Paseos" },
    { value: 2115, text: "Parques y Paseos futuras planificaciones" },
];

// ─── Componente de sección con título ────────────────────────────────────────
const Section = ({ title, subtitle, children }) => (
    <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-6 space-y-4">
        {(title || subtitle) && (
            <div className="pb-3 border-b border-gray-700">
                {title && (
                    <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                        {title}
                    </h3>
                )}
                {subtitle && (
                    <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
                )}
            </div>
        )}
        {children}
    </div>
);

// ─── Componente principal ─────────────────────────────────────────────────────
const GestionSua = () => {
    const dispatch = useDispatch();
    const { errors, idArea, legend, executionDate, resolutionDate } =
        useSelector((store) => store.batches);

    const [activeTab, setActiveTab] = useState("resoluciones");

    // Estado resoluciones
    const [resFile, setResFile] = useState(null);
    const [resJsonData, setResJsonData] = useState([]);
    const [resHeaders, setResHeaders] = useState([]);
    const [resStatus, setResStatus] = useState("");
    const [resRowStatus, setResRowStatus] = useState({});

    // Estado derivaciones
    const [derFile, setDerFile] = useState(null);
    const [derJsonData, setDerJsonData] = useState([]);
    const [derHeaders, setDerHeaders] = useState([]);
    const [derStatus, setDerStatus] = useState("");
    const [derRowStatus, setDerRowStatus] = useState({});
    const [idAreaDerivada, setIdAreaDerivada] = useState(2098);

    const onChange = (e) => {
        if (e.target.name === "legend") dispatch(setLegend(e.target.value));
        else if (e.target.name === "resolutionDate")
            dispatch(setResolutionDate(e.target.value));
        else if (e.target.name === "executionDate")
            dispatch(setExecutionDate(e.target.value));
        else if (e.target.name === "idArea")
            dispatch(setIdArea(e.target.value));
    };

    const resetForm = () => {
        dispatch(setLegend(""));
        dispatch(setResolutionDate(""));
        dispatch(setExecutionDate(""));
    };

    const isFormComplete = () =>
        legend?.trim() !== "" &&
        resolutionDate !== "" &&
        executionDate !== "" &&
        idArea;

    const isDerivacionFormComplete = () => isFormComplete() && idAreaDerivada;

    // ─── Handlers Resoluciones ────────────────────────────────────────────────
    const handleResFileChange = (e) => {
        setResFile(e.target.files[0]);
        setResJsonData([]);
        setResHeaders([]);
        setResStatus("");
        setResRowStatus({});
    };

    const handleResParse = () => {
        if (!resFile)
            return sweetAlert.fire({
                type: "warning",
                title: "Archivo requerido",
                message: "Debe seleccionar un archivo CSV.",
            });
        Papa.parse(resFile, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                if (!results.data.length)
                    return sweetAlert.fire({
                        type: "warning",
                        title: "Archivo vacío",
                        message: "El archivo no contiene registros válidos.",
                    });
                setResJsonData(results.data);
                setResHeaders(results.meta.fields);
                sweetAlert.fire({
                    type: "success",
                    title: "Archivo cargado",
                    message: `Se cargaron ${results.data.length} registros.`,
                });
            },
            error: () =>
                sweetAlert.fire({
                    type: "error",
                    title: "Error",
                    message: "No se pudo leer el archivo CSV.",
                }),
        });
    };

    const handleResDescargarErrores = () => {
        if (!errors?.length) return;
        const link = document.createElement("a");
        link.setAttribute(
            "href",
            URL.createObjectURL(
                new Blob([Papa.unparse(errors)], {
                    type: "text/csv;charset=utf-8;",
                }),
            ),
        );
        link.setAttribute("download", "errores_resoluciones.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleResProcessAPI = async () => {
        if (!isFormComplete())
            return sweetAlert.fire({
                type: "warning",
                title: "Formulario incompleto",
                message: "Completá todos los campos obligatorios.",
            });
        if (!resJsonData.length)
            return sweetAlert.fire({
                type: "info",
                title: "Sin datos",
                message: "Cargá un archivo CSV primero.",
            });

        const confirm = await sweetAlert.fire({
            type: "question",
            title: "¿Confirmar procesamiento?",
            message: "Se agendarán las resoluciones cargadas.",
            showCancelButton: true,
            confirmButtonText: "Sí, procesar",
            cancelButtonText: "Cancelar",
        });
        if (!confirm.isConfirmed) return;

        setResStatus("Procesando...");
        try {
            await dispatch(
                postBatches({
                    idArea,
                    type: "RESOLUCION",
                    resolutionDate,
                    scheduledFor: executionDate,
                    data: { legend, tipoResolucion: 1, id_motivo_cierre: 0 },
                    records: resJsonData,
                }),
            ).unwrap();

            sweetAlert.fire({
                type: "success",
                title: "Proceso exitoso",
                message: "Las resoluciones fueron agendadas correctamente.",
            });
            setResStatus("Agendado correctamente");
            setResFile(null);
            setResJsonData([]);
            setResHeaders([]);
            setResRowStatus({});
            const input = document.getElementById("res-file-upload");
            if (input) input.value = "";
            resetForm();
        } catch (error) {
            sweetAlert.fire({
                type: "error",
                title: "Error al procesar",
                message: error?.message || "Ocurrió un error.",
            });
            setResStatus("Error en el procesamiento");
        }
    };

    // ─── Handlers Derivaciones ────────────────────────────────────────────────
    const handleDerFileChange = (e) => {
        setDerFile(e.target.files[0]);
        setDerJsonData([]);
        setDerHeaders([]);
        setDerStatus("");
        setDerRowStatus({});
    };

    const handleDerParse = () => {
        if (!derFile)
            return sweetAlert.fire({
                type: "warning",
                title: "Archivo requerido",
                message: "Debe seleccionar un archivo CSV.",
            });
        Papa.parse(derFile, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                if (!results.data.length)
                    return sweetAlert.fire({
                        type: "warning",
                        title: "Archivo vacío",
                        message: "El archivo no contiene registros válidos.",
                    });
                setDerJsonData(results.data);
                setDerHeaders(results.meta.fields);
                sweetAlert.fire({
                    type: "success",
                    title: "Archivo cargado",
                    message: `Se cargaron ${results.data.length} registros.`,
                });
            },
            error: () =>
                sweetAlert.fire({
                    type: "error",
                    title: "Error",
                    message: "No se pudo leer el archivo CSV.",
                }),
        });
    };

    const handleDerDescargarErrores = () => {
        if (!errors?.length) return;
        const link = document.createElement("a");
        link.setAttribute(
            "href",
            URL.createObjectURL(
                new Blob([Papa.unparse(errors)], {
                    type: "text/csv;charset=utf-8;",
                }),
            ),
        );
        link.setAttribute("download", "errores_derivaciones.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDerProcessAPI = async () => {
        if (!isDerivacionFormComplete())
            return sweetAlert.fire({
                type: "warning",
                title: "Formulario incompleto",
                message:
                    "Completá todos los campos incluyendo área de destino.",
            });
        if (!derJsonData.length)
            return sweetAlert.fire({
                type: "info",
                title: "Sin datos",
                message: "Cargá un archivo CSV primero.",
            });

        const confirm = await sweetAlert.fire({
            type: "question",
            title: "¿Confirmar procesamiento?",
            message: "Se agendarán las derivaciones cargadas.",
            showCancelButton: true,
            confirmButtonText: "Sí, procesar",
            cancelButtonText: "Cancelar",
        });
        if (!confirm.isConfirmed) return;

        setDerStatus("Procesando...");
        try {
            await dispatch(
                postBatches({
                    idArea,
                    type: "DERIVACION",
                    resolutionDate,
                    scheduledFor: executionDate,
                    data: {
                        legend,
                        tipoResolucion: 2,
                        id_motivo_cierre: 0,
                        id_area_derivada: idAreaDerivada,
                    },
                    records: derJsonData,
                }),
            ).unwrap();

            sweetAlert.fire({
                type: "success",
                title: "Proceso exitoso",
                message: "Las derivaciones fueron agendadas correctamente.",
            });
            setDerStatus("Agendado correctamente");
            setDerFile(null);
            setDerJsonData([]);
            setDerHeaders([]);
            setDerRowStatus({});
            const input = document.getElementById("der-file-upload");
            if (input) input.value = "";
            resetForm();
        } catch (error) {
            sweetAlert.fire({
                type: "error",
                title: "Error al procesar",
                message: error?.message || "Ocurrió un error.",
            });
            setDerStatus("Error en el procesamiento");
        }
    };

    // ─── Render ───────────────────────────────────────────────────────────────
    return (
        <div className="w-full max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-white tracking-widest uppercase">
                        Gestión SUA
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">
                        Procesamiento masivo de resoluciones y derivaciones
                    </p>
                </div>

                {/* Pestañas */}
                <div className="flex gap-2 p-1 bg-gray-900/50 rounded-xl w-fit">
                    {[
                        { id: "resoluciones", label: "📄 Resoluciones" },
                        { id: "derivaciones", label: "🔀 Derivaciones" },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all
                                ${
                                    activeTab === tab.id
                                        ? "bg-indigo-600 text-white shadow-md"
                                        : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── RESOLUCIONES ── */}
            {activeTab === "resoluciones" && (
                <>
                    <Section
                        title="Leyenda"
                        subtitle="Texto descriptivo de la resolución"
                    >
                        <TextArea
                            name="legend"
                            onChange={onChange}
                            placeholder="Escribe aquí la resolución..."
                            value={legend}
                        />
                    </Section>

                    <Section
                        title="Fechas"
                        subtitle="Fechas de resolución y ejecución"
                    >
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <Label label="Fecha de resolución" />
                                <Input
                                    value={resolutionDate}
                                    name="resolutionDate"
                                    onChange={onChange}
                                    type="datetime-local"
                                    step="1"
                                />
                            </div>
                            <div>
                                <Label label="Fecha y hora de ejecución" />
                                <Input
                                    value={executionDate}
                                    name="executionDate"
                                    onChange={onChange}
                                    type="datetime-local"
                                    step="1"
                                />
                            </div>
                        </div>
                    </Section>

                    <Section
                        title="Área de SUA"
                        subtitle="Área a la que se aplica la resolución"
                    >
                        <Select
                            name="idArea"
                            value={idArea}
                            onChange={onChange}
                            options={AREAS}
                        />
                    </Section>

                    <Section
                        title="Archivo CSV"
                        subtitle="Cargá el archivo con los registros a procesar"
                    >
                        <CsvProcessor
                            fileInputId="res-file-upload"
                            errores={errors}
                            file={resFile}
                            handleDescargarErrores={handleResDescargarErrores}
                            handleFileChange={handleResFileChange}
                            handleParse={handleResParse}
                            jsonData={resJsonData}
                            headers={resHeaders}
                            status={resStatus}
                            handleProcessAPI={handleResProcessAPI}
                            rowStatus={resRowStatus}
                        />
                    </Section>
                </>
            )}

            {/* ── DERIVACIONES ── */}
            {activeTab === "derivaciones" && (
                <>
                    <Section
                        title="Leyenda"
                        subtitle="Texto descriptivo de la derivación"
                    >
                        <TextArea
                            name="legend"
                            onChange={onChange}
                            placeholder="Escribe aquí la derivación..."
                            value={legend}
                        />
                    </Section>

                    <Section
                        title="Fechas"
                        subtitle="Fechas de derivación y ejecución"
                    >
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <Label label="Fecha de derivación" />
                                <Input
                                    value={resolutionDate}
                                    name="resolutionDate"
                                    onChange={onChange}
                                    type="datetime-local"
                                    step="1"
                                />
                            </div>
                            <div>
                                <Label label="Fecha y hora de ejecución" />
                                <Input
                                    value={executionDate}
                                    name="executionDate"
                                    onChange={onChange}
                                    type="datetime-local"
                                    step="1"
                                />
                            </div>
                        </div>
                    </Section>

                    <Section
                        title="Áreas"
                        subtitle="Área de origen y área de destino de la derivación"
                    >
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <Label label="Área de origen" />
                                <Select
                                    name="idArea"
                                    value={idArea}
                                    onChange={onChange}
                                    options={AREAS}
                                />
                            </div>
                            <div>
                                <Label label="Área de destino" />
                                <Select
                                    name="idAreaDerivada"
                                    value={idAreaDerivada}
                                    onChange={(e) =>
                                        setIdAreaDerivada(e.target.value)
                                    }
                                    options={AREAS}
                                />
                            </div>
                        </div>
                    </Section>

                    <Section
                        title="Archivo CSV"
                        subtitle="Cargá el archivo con los registros a derivar"
                    >
                        <CsvProcessor
                            fileInputId="der-file-upload"
                            errores={errors}
                            file={derFile}
                            handleDescargarErrores={handleDerDescargarErrores}
                            handleFileChange={handleDerFileChange}
                            handleParse={handleDerParse}
                            jsonData={derJsonData}
                            headers={derHeaders}
                            status={derStatus}
                            handleProcessAPI={handleDerProcessAPI}
                            rowStatus={derRowStatus}
                        />
                    </Section>
                </>
            )}
        </div>
    );
};

export default GestionSua;
