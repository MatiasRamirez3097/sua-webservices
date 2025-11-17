import Div from "../div/Div";

const CsvProcessor = ({
    errores,
    file,
    jsonData,
    handleFileChange,
    handleParse,
    handleProcessAPI,
    handleDescargarErrores,
    status,
    headers,
    rowStatus,
}) => {
    // Función auxiliar para colores
    const getRowStyle = (index) => {
        // Verificamos si rowStatus existe para evitar errores si es undefined
        if (!rowStatus) return {};

        const state = rowStatus[index];
        if (state === "success") return { backgroundColor: "#d4edda" }; // Verde
        if (state === "error") return { backgroundColor: "#f8d7da" }; // Rojo

        return {}; // Sin color
    };

    return (
        // Contenedor principal
        <Div>
            {/* Título principal */}
            <h2 className="text-2xl font-bold text-white text-center p-10">
                Procesador de CSV
            </h2>

            {/* Sección para subir archivo */}
            <div className="flex flex-col items-center gap-4">
                {/* LABEL COMO BOTÓN PARA SUBIR ARCHIVO */}
                <label
                    htmlFor="file-upload"
                    className="bg-indigo-900 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-indigo-600 transition"
                >
                    Seleccionar archivo
                </label>

                {/* INPUT REAL OCULTO */}
                <input
                    id="file-upload"
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="hidden"
                />

                {/* NOMBRE DEL ARCHIVO */}
                <p className="text-sm text-gray-300 italic">
                    {file ? file.name : "Ningún archivo seleccionado"}
                </p>

                {/* GRUPO DE BOTONES EN FILA */}
                <div className="flex gap-4">
                    {/* BOTÓN: CARGAR Y MOSTRAR CSV */}
                    <button
                        onClick={handleParse}
                        disabled={!file}
                        className={`px-6 py-2 rounded-md text-white font-medium transition-colors duration-200 
							${
                                file
                                    ? "bg-indigo-900 hover:bg-indigo-700 cursor-pointer"
                                    : "bg-gray-700 cursor-not-allowed"
                            }`}
                    >
                        Cargar y Mostrar CSV
                    </button>

                    {/*BOTON PROCESAR FILAS EN API*/}
                    <button
                        onClick={handleProcessAPI}
                        disabled={jsonData.length === 0}
                        className={`px-6 py-2 rounded-md font-medium transition-colors duration-200
							${
                                jsonData.length > 0
                                    ? "bg-indigo-900 hover:bg-indigo-700 cursor-pointer"
                                    : "bg-gray-700 cursor-not-allowed"
                            }`}
                    >
                        Procesar {jsonData.length} filas
                    </button>
                </div>
            </div>
            {/* Mostrar botón solo si hay errores en el array */}
            {errores && errores.length > 0 && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
                    <div className="text-red-700">
                        <p className="font-bold">
                            ⚠️ Se encontraron {errores.length} errores
                        </p>
                        <p className="text-sm">
                            Descarga el reporte para revisarlos manualmente.
                        </p>
                    </div>

                    <button
                        onClick={handleDescargarErrores}
                        className="px-4 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition shadow-sm flex items-center gap-2"
                    >
                        {/* Icono de descarga opcional */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                        </svg>
                        Descargar CSV Errores
                    </button>
                </div>
            )}

            {/* Tabla: se muestra solo si hay datos cargados */}
            {jsonData.length > 0 && (
                <div className="mt-6">
                    {/* Subtítulo de la tabla */}
                    <h3 className="text-lg font-semibold mb-3 text-white">
                        Datos del CSV
                    </h3>

                    {/* Contenedor de tabla con scroll horizontal y sombra */}
                    <div className="overflow-x-auto overflow-y-auto max-h-80 rounded-lg shadow">
                        <table className="w-full border text-center border-gray-300 border-collapse rounded-lg overflow-hidden">
                            {/* Encabezados: fondo gris y texto en mayúscula */}
                            <thead className="bg-gray-400 text-black">
                                <tr>
                                    {headers.map((header) => (
                                        <th
                                            key={header}
                                            className="px-4 py-2 text-center font-bold border border-black-400"
                                        >
                                            {header}
                                        </th>
                                    ))}
                                    <th>Resultado</th>
                                </tr>
                            </thead>

                            {/* Filas del cuerpo: colores alternados (blanco / gris claro) */}
                            <tbody>
                                {jsonData.map((row, index) => (
                                    <tr
                                        key={index}
                                        // 3. AQUI APLICAS EL ESTILO DINÁMICO
                                        style={getRowStyle(index)}
                                    >
                                        {headers.map((header) => (
                                            <td
                                                key={`${index}-${header}`}
                                                style={{ padding: "8px" }}
                                            >
                                                {row[header]}
                                            </td>
                                        ))}

                                        {/* Columna de estado (ícono) */}
                                        <td style={{ textAlign: "center" }}>
                                            {rowStatus[index] === "success" &&
                                                "✅"}
                                            {rowStatus[index] === "error" &&
                                                "❌"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </Div>
    );
};

export default CsvProcessor;
