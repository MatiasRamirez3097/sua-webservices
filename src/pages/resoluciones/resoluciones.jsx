import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fechaResolucionAction,
    leyendaAction,
    postResolucion,
    usuarioResolucionAction,
} from "../../redux/actions/resolucionesActions";
import Papa from "papaparse"; // Importamos papaparse

import CsvProcessor from "../../components/csv/CsvProcessor";

import TextArea from "../../components/textarea/TextArea";

import H2 from "../../components/h2/H2";

import Input from "../../components/input/Input"

import Div from "../../components/div/Div";

const Resoluciones = () => {
    const dispatch = useDispatch();
    const { errores, leyenda, fechaResolucion, usuarioResolucion, } = useSelector(
        (store) => store.resolucionesReducer
    );

    const [file, setFile] = useState(null);
    const [jsonData, setJsonData] = useState([]);
    const [headers, setHeaders] = useState([]);
    const [status, setStatus] = useState(""); // Para mostrar el estado del envío

    const [rowStatus, setRowStatus] = useState({});

    const onChange = (e) => {
        if (e.target.name == "leyenda") dispatch(leyendaAction(e.target.value));
        else if (e.target.name == "fecha") dispatch(fechaResolucionAction(e.target.value))
        else if (e.target.name == "usuarioresolucion") dispatch(usuarioResolucionAction(e.target.value))
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
        if (jsonData.length === 0) {
            alert("No hay datos para procesar. Carga un CSV.");
            return;
        }

        setStatus("Procesando... por favor espera.");

        let count = 0;
        for (const [index, row] of jsonData.entries()) {
            count++;
            setStatus(`Procesando fila ${count} de ${jsonData.length}...`);
            try {
                await dispatch(
                    postResolucion({
                        sua: row.sua,
                        anio: row.anio,
                        leyenda: leyenda,
                    })
                ).unwrap();

                setRowStatus((prev) => ({ ...prev, [index]: "success" }));
            } catch (error) {
                console.error("Error en fila:", index, error);
                setRowStatus((prev) => ({ ...prev, [index]: "error" }));
            }
        }

        if (count === jsonData.length) {
            setStatus("¡Proceso completado! Todas las filas fueron enviadas.");
        }
    };

    return (
        <Div>
            <H2 label="RESOLUCIONES MASIVAS BRO"/>
            <TextArea
                label="Ingresar la leyenda de resolución"
                name="leyenda"
                onChange={(e) => onChange(e)}
                placeholder="Escribe aquí la resolución..."
                value={leyenda}
            />
            <div className="flex gap-4">
                <div className="flex-1">
                    <Input
                        label="Ingresar la fecha de resolución"
                        value={fechaResolucion}
                        name="fecha"
                        onChange={(e) => onChange(e)}
                        type="datetime-local"
                        step="1"
                    />
                </div>
                <div className="flex-1">
                    <Input
                        label="Ingresar nombre del usuario"
                        name="usuarioresolucion"
                        type="text"
                        value={usuarioResolucion}
                        onChange={(e) => onChange(e)}
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
