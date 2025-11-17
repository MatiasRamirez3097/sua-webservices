import React, { useState } from 'react';
import {useDispatch, useSelector} from 'react-redux'
import { leyendaAction, postResolucion } from '../../redux/actions/resolucionesActions';
import Papa from 'papaparse'; // Importamos papaparse

import CsvProcessor from "../../components/csv/CsvProcessor";

import { TextArea } from '../../components';

import { H2 } from '../../components'

import {Div} from '../../components'

const Resoluciones = () => {
    const dispatch = useDispatch()
    const {leyenda} = useSelector(store => store.resolucionesReducer)

    const [file, setFile] = useState(null);
    const [jsonData, setJsonData] = useState([]);
    const [headers, setHeaders] = useState([]);
    const [status, setStatus] = useState(''); // Para mostrar el estado del envío

    const [rowStatus, setRowStatus] = useState({})

    const onChange = (e) => {
        dispatch(leyendaAction(e.target.value))
    }
    // Maneja la selección del archivo
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setJsonData([]); // Limpiamos datos anteriores
        setHeaders([]); // Limpiamos cabeceras
        setStatus('');
        setRowStatus({})
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
        }
        });
    };

    // Itera y envía los datos a la API
    const handleProcessAPI = async () => {
        if (jsonData.length === 0) {
            alert("No hay datos para procesar. Carga un CSV.");
            return;
        }

        setStatus('Procesando... por favor espera.');

        let count = 0;
        for (const [index, row] of jsonData.entries()) {
            count++;
            setStatus(`Procesando fila ${count} de ${jsonData.length}...`);
            try{
                await dispatch(postResolucion({
                    sua: row.sua,
                    anio: row.anio,
                    leyenda: leyenda
                })).unwrap()

                setRowStatus(prev => ({...prev, [index]: 'success'}))
            } catch (error) {
                console.error("Error en fila:", index, error)
                setRowStatus(prev => ({ ...prev, [index]: 'error'}))
            }
        }

        if (count === jsonData.length) {
            setStatus('¡Proceso completado! Todas las filas fueron enviadas.');
        }
    };

    return (
        <Div>
            <H2
                label="Ingresar la leyenda de resolución"
            />
            <TextArea
                name="leyenda"
                onChange={(e) => onChange(e)}
                placeholder="Escribe aquí la resolución..."
                value={leyenda}
            />
            <CsvProcessor 
                file={file}
                handleFileChange={handleFileChange}
                handleParse={handleParse}
                jsonData={jsonData}
                headers={headers}
                status={status}
                handleProcessAPI={handleProcessAPI}
                rowStatus={rowStatus}
            />
        </Div>
    )
}

export default Resoluciones;