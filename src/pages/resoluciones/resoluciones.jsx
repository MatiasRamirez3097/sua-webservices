import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Papa from "papaparse"; // Importamos papaparse
import {
    fechaEjecucionAction,
    fechaResolucionAction,
    idAreaAction,
    leyendaAction,
    postBatchs,
} from "../../redux/actions/batchsActions";

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
    const { errores, idArea, leyenda, fechaEjecucion, fechaResolucion } =
        useSelector((store) => store.batchsReducer);
    const { user } = useSelector((store) => store.usersReducer);

    const [file, setFile] = useState(null);
    const [jsonData, setJsonData] = useState([]);
    const [headers, setHeaders] = useState([]);
    const [status, setStatus] = useState(""); // Para mostrar el estado del envío

    const [rowStatus, setRowStatus] = useState({});

    const onChange = (e) => {
        if (e.target.name == "leyenda") dispatch(leyendaAction(e.target.value));
        else if (e.target.name == "fecha")
            dispatch(fechaResolucionAction(e.target.value));
        else if (e.target.name == "fechaEjecucion")
            dispatch(fechaEjecucionAction(e.target.value));
        else if (e.target.name == "idArea") {
            dispatch(idAreaAction(e.target.value));
        }
    };
    // Maneja la selección del archivo
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setJsonData([]); // Limpiamos datos anteriores
        setHeaders([]); // Limpiamos cabeceras
        setStatus("");
        setRowStatus({});
    };

    const handleDescargarErrores = () => {
        if (!errores || errores.length === 0) return;

        // 1. Convertir JSON a CSV
        const csv = Papa.unparse(errores);

        // 2. Crear un Blob (archivo en memoria)
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

        // 3. Crear link de descarga temporal
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "reporte_errores.csv");
        link.style.visibility = "hidden";

        // 4. Simular click y limpiar
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Parsea el CSV cuando se presiona el botón "Cargar"
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
            header: true, // ¡Importante! Trata la primera fila como cabecera
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
            resolutionText?.trim() !== "" &&
            selectedType !== "" &&
            executionDate !== ""
        );
    };

    // Itera y envía los datos a la API
    const handleProcessAPI = async () => {
        if (!isFormComplete) {
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
            await dispatch(
                postBatchs({
                    idArea: idArea,
                    type: "RESOLUCION",
                    date: fechaResolucion,
                    scheduledFor: fechaEjecucion,
                    data: {
                        leyenda: leyenda,
                        tipoResolucion: 1,
                        id_motivo_cierre: 0,
                    },
                    records: jsonData,
                })
            );

            sweetAlert.fire({
                type: "success",
                title: "Proceso exitoso",
                message: "Las resoluciones fueron agendadas correctamente.",
            });

            setStatus("Agendado correctamente");
        } catch (error) {
            sweetAlert.fire({
                type: "error",
                title: "Error",
                message: "Ocurrió un error al procesar la información.",
            });
        }
    };

    return (
        <Div>
            <H2 label="RESOLUCIONES MASIVAS" />
            <Div>
                <Label label="Ingresar la leyenda de resolución" />
                <TextArea
                    name="leyenda"
                    onChange={(e) => onChange(e)}
                    placeholder="Escribe aquí la resolución..."
                    value={leyenda}
                />
            </Div>
            <div className="flex gap-4 w-full max-w-4xl mx-auto border border-gray-300 p-6 bg-gray-800 rounded-xl mb-8">
                <div className="flex-1">
                    <Label label="Ingresar la fecha de resolución" />
                    <Input
                        value={fechaResolucion}
                        name="fecha"
                        onChange={(e) => onChange(e)}
                        type="datetime-local"
                        step="1"
                    />
                </div>
                <div className="flex-1">
                    <Label label="Fecha y hora ejecucion" />
                    <Input
                        value={fechaEjecucion}
                        name="fechaEjecucion"
                        onChange={(e) => onChange(e)}
                        type="datetime-local"
                        step="1"
                    />
                </div>
            </div>
            <Div>
                <div className="flex-1">
                    <Label label="Area de SUA" />
                    <Select
                        name="idArea"
                        value={idArea}
                        onChange={(e) => onChange(e)}
                        options={[
                            {
                                value: 2098,
                                text: "Parques y Paseos",
                            },
                            {
                                value: 2115,
                                text: "Parques y Paseos futuras planificaciones",
                            },
                        ]}
                    />
                </div>
            </Div>
            <CsvProcessor
                errores={errores}
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
    );
};

export default Resoluciones;
