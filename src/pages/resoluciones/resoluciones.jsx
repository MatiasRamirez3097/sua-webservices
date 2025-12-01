import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Papa from "papaparse"; // Importamos papaparse
import {
    fechaResolucionAction,
    leyendaAction,
    postResolucion,
} from "../../redux/actions/resolucionesActions";

import {
    CsvProcessor,
    Div,
    H2,
    Input,
    Label,
    TextArea,
} from "../../components";

const Resoluciones = () => {
    const dispatch = useDispatch();
    const { errores, leyenda, fechaResolucion } = useSelector(
        (store) => store.resolucionesReducer
    );
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
            alert("Por favor, selecciona un archivo CSV primero.");
            return;
        }

        Papa.parse(file, {
            header: true, // ¡Importante! Trata la primera fila como cabecera
            skipEmptyLines: true,
            complete: (results) => {
                // results.data es un array de objetos
                // results.meta.fields son los nombres de las columnas
                setJsonData(results.data);
                setHeaders(results.meta.fields);
            },
            error: (error) => {
                console.error("Error al parsear el CSV:", error);
                setStatus("Error al leer el archivo.");
            },
        });
    };

    // Itera y envía los datos a la API
    const handleProcessAPI = async () => {
        console.log(leyenda);
        if (jsonData.length === 0) {
            alert("No hay datos para procesar. Carga un CSV.");
            return;
        }

        setStatus("Procesando... por favor espera.");
        try {
            await dispatch(
                postResolucion({
                    type: "RESOLUCION",
                    date: fechaResolucion,
                    scheduledFor: fechaResolucion,
                    data: {
                        leyenda: leyenda,
                        tipoResolucion: 1,
                        id_motivo_cierre: 0,
                    },
                    records: jsonData,
                })
            );
        } catch (error) {
            console.error("Error!");
        }
        setStatus("Agendado correctamente");
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
            </div>
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
