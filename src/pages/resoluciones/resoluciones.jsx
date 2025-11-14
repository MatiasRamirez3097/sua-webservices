import React, { useState } from 'react';
import {useDispatch, useSelector} from 'react-redux'
import { leyendaAction } from '../../redux/actions/resolucionesActions';
import Papa from 'papaparse'; // Importamos papaparse

import CsvProcessor from "../../components/csv/CsvProcessor";

import { Input } from '../../components';

const Resoluciones = () => {
    const dispatch = useDispatch()
    const {leyenda} = useSelector(store => store.resolucionesReducer)

    const [file, setFile] = useState(null);
    const [jsonData, setJsonData] = useState([]);
    const [headers, setHeaders] = useState([]);
    const [status, setStatus] = useState(''); // Para mostrar el estado del envío
    

    const onChange = (e) => {
        dispatch(leyendaAction(e.target.value))
    }
    // Maneja la selección del archivo
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setJsonData([]); // Limpiamos datos anteriores
        setHeaders([]); // Limpiamos cabeceras
        setStatus('');
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

        // Usamos un bucle 'for...of' para poder usar 'await' correctamente
        // Un 'forEach' con 'async' no esperará a que terminen las promesas.
        let count = 0;
        for (const row of jsonData) {
            count++;
            setStatus(`Procesando fila ${count} de ${jsonData.length}...`);

            try {
                // Simulamos el envío a una API (reemplaza con tu URL real)
                const response = await fetch('https://api.ejemplo.com/tu-endpoint', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Aquí irían otros headers, como 'Authorization' si es necesario
                },
                    body: JSON.stringify(row) // 'row' es el objeto de la fila: { col1: 'val', col2: 'val', col3: 'val' }
                });

                if (!response.ok) {
                    // Si la API devuelve un error (ej. 400, 500)
                    console.error(`Error en la fila ${count}:`, row);
                    // Opcional: podrías detener el proceso aquí si un fallo es crítico
                    // throw new Error(`HTTP error! status: ${response.status}`);
                }

                // (Opcional) Leer la respuesta de la API
                // const apiResult = await response.json();
                // console.log(`Resultado fila ${count}:`, apiResult);

            } catch (error) {
                console.error("Error al enviar la fila:", row, error);
                setStatus(`Error en la fila ${count}. Revisa la consola.`);
                // Detenemos el bucle si hay un error de red
                break; 
            }
        }

        if (count === jsonData.length) {
        setStatus('¡Proceso completado! Todas las filas fueron enviadas.');
        }
    };

    return (
        <div>
            <h5>Resoluciones!</h5>
            <Input
                name="leyenda"
                onChange={(e) => onChange(e)}
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
            />
        </div>
    )
}

export default Resoluciones;