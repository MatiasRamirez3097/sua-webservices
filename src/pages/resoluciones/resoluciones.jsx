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
import {
    CsvProcessor,
    Div,
    H2,
    Input,
    Label,
    Select,
    TextArea,
} from "../../components";

import { sweetAlert } from "../../components/alerts/SweetAlert";

const Resoluciones = () => {
    const dispatch = useDispatch();
    const { errors, idArea, legend, executionDate, resolutionDate } =
        useSelector((store) => store.batches);

    const [file, setFile] = useState(null);
    const [jsonData, setJsonData] = useState([]);
    const [headers, setHeaders] = useState([]);
    const [status, setStatus] = useState("");
    const [rowStatus, setRowStatus] = useState({});

    const onChange = (e) => {
        if (e.target.name === "legend") dispatch(setLegend(e.target.value));
        else if (e.target.name === "resolutionDate")
            dispatch(setResolutionDate(e.target.value));
        else if (e.target.name === "executionDate")
            dispatch(setExecutionDate(e.target.value));
        else if (e.target.name === "idArea")
            dispatch(setIdArea(e.target.value));
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setJsonData([]);
        setHeaders([]);
        setStatus("");
        setRowStatus({});
    };

    const handleDescargarErrores = () => {
        if (!errors || errors.length === 0) return;

        const csv = Papa.unparse(errors);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "reporte_errores.csv");
        link.style.visibility = "hidden";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleParse = () => {
        if (!file) {
            sweetAlert.fire({
                type: "warning",
                title: "Archivo requerido",
                message: "Debe seleccionar un archivo CSV antes de continuar.",
            });
            return;
        }

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                if (results.data.length === 0) {
                    sweetAlert.fire({
                        type: "warning",
                        title: "Archivo vacío",
                        message:
                            "El archivo CSV no contiene registros válidos.",
                    });
                    return;
                }

                setJsonData(results.data);
                setHeaders(results.meta.fields);

                sweetAlert.fire({
                    type: "success",
                    title: "Archivo cargado",
                    message: `Se cargaron ${results.data.length} registros correctamente.`,
                });
            },
            error: () => {
                sweetAlert.fire({
                    type: "error",
                    title: "Error",
                    message: "No se pudo leer el archivo CSV.",
                });
            },
        });
    };

    const isFormComplete = () => {
        return (
            legend?.trim() !== "" &&
            resolutionDate !== "" &&
            executionDate !== "" &&
            idArea
        );
    };

    const handleProcessAPI = async () => {
        if (!isFormComplete()) {
            sweetAlert.fire({
                type: "warning",
                title: "Formulario incompleto",
                message:
                    "Debe completar todos los campos obligatorios antes de procesar.",
            });
            return;
        }

        if (jsonData.length === 0) {
            sweetAlert.fire({
                type: "info",
                title: "Sin datos",
                text: "No hay registros para procesar. Cargue un archivo CSV.",
            });
            return;
        }

        const confirm = await sweetAlert.fire({
            type: "question",
            title: "¿Confirmar procesamiento?",
            message: "Se agendarán las resoluciones cargadas.",
            showCancelButton: true,
            confirmButtonText: "Sí, procesar",
            cancelButtonText: "Cancelar",
        });

        if (!confirm.isConfirmed) return;

        setStatus("Procesando... por favor espera.");

        try {
            const response = await dispatch(
                postBatches({
                    idArea: idArea,
                    type: "RESOLUCION",
                    resolutionDate: resolutionDate,
                    scheduledFor: executionDate,
                    data: {
                        legend: legend,
                        tipoResolucion: 1,
                        id_motivo_cierre: 0,
                    },
                    records: jsonData,
                }),
            ).unwrap();

            sweetAlert.fire({
                type: "success",
                title: "Proceso exitoso",
                message: "Las resoluciones fueron agendadas correctamente.",
            });

            setStatus("Agendado correctamente");

            // ✅ Limpieza después del éxito
            setFile(null);
            setJsonData([]);
            setHeaders([]);
            setRowStatus({});

            const fileInput = document.getElementById("file-upload");
            if (fileInput) fileInput.value = "";

            dispatch(setLegend(""));
            dispatch(setResolutionDate(""));
            dispatch(setExecutionDate(""));
        } catch (error) {
            console.error("Error real:", error);

            sweetAlert.fire({
                type: "error",
                title: "Error al procesar",
                message:
                    error?.message ||
                    "Ocurrió un error al procesar la información.",
            });

            setStatus("Error en el procesamiento");
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6">
            {/* BLOQUE 1 - Título + Leyenda */}
            <Div className="border border-gray-700 p-6 bg-gray-800 rounded-xl">
                <div className="border-b border-gray-700 pb-4 mb-6">
                    <H2
                        className="text-2xl font-bold text-white tracking-widest uppercase"
                        label="Resoluciones Masivas"
                    />
                    <p className="text-gray-400 text-sm mt-1">
                        Carga y procesamiento de resoluciones en lote
                    </p>
                </div>
                <div className="flex gap-6">
                    <div className="w-full flex flex-col">
                        <Label label="Leyenda de resolución" />
                        <TextArea
                            name="legend"
                            onChange={onChange}
                            placeholder="Escribe aquí la resolución..."
                            value={legend}
                        />
                    </div>
                </div>
            </Div>

            {/* BLOQUE 2 - Fechas */}
            <Div className="border border-gray-700 p-6 bg-gray-800 rounded-xl">
                <div className="flex gap-6">
                    <div className="flex-1">
                        <Label label="Fecha de resolución" />
                        <Input
                            value={resolutionDate}
                            name="resolutionDate"
                            onChange={onChange}
                            type="datetime-local"
                            step="1"
                        />
                    </div>
                    <div className="flex-1">
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
            </Div>

            {/* BLOQUE 3 - Área */}
            <Div className="border border-gray-700 p-6 bg-gray-800 rounded-xl">
                <Label label="Área de SUA" />
                <Select
                    name="idArea"
                    value={idArea}
                    onChange={onChange}
                    options={[
                        { value: 2098, text: "Parques y Paseos" },
                        {
                            value: 2115,
                            text: "Parques y Paseos futuras planificaciones",
                        },
                    ]}
                />
            </Div>

            {/* BLOQUE 4 - CSV */}
            <Div className="border border-gray-700 p-6 bg-gray-800 rounded-xl">
                <CsvProcessor
                    errores={errors}
                    file={file}
                    handleDescargarErrores={handleDescargarErrores}
                    handleFileChange={handleFileChange}
                    handleParse={handleParse}
                    jsonData={jsonData}
                    headers={headers}
                    status={status}
                    handleProcessAPI={handleProcessAPI}
                    rowStatus={rowStatus}
                />
            </Div>
        </div>
    );
};

export default Resoluciones;
