import Div from "../div/Div";
import Label from "../label/Label";

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
    const getRowStyle = (index) => {
        if (!rowStatus) return {};

        const state = rowStatus[index];
        if (state === "success") return { backgroundColor: "#d4edda" };
        if (state === "error") return { backgroundColor: "#f8d7da" };

        return {};
    };

    return (
        <div>
            <Label label="Procesador de CSV" />

            {/* SECCIÓN SUBIR ARCHIVO MODIFICADA */}
            <div className="flex flex-col items-center gap-4">
                {/* ZONA COMPLETA CLICKEABLE */}
                <label
                    htmlFor="file-upload"
                    className="w-80 h-40 flex flex-col items-center justify-center bg-indigo-900
                               border-2 border-dashed border-gray-500 
                               rounded-lg cursor-pointer 
                               hover:bg-indigo-700 transition"
                >
                    <p className="text-white font-medium">
                        {file
                            ? file.name
                            : "Tocar aquí para seleccionar archivo CSV"}
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                        Solo archivos .csv
                    </p>
                </label>

                {/* INPUT REAL OCULTO */}
                <input
                    id="file-upload"
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="hidden"
                />

                {/* BOTONES */}
                <div className="flex gap-4">
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

                    <button
                        onClick={handleProcessAPI}
                        disabled={jsonData.length === 0}
                        className={`px-6 py-2 rounded-md font-medium text-white transition-colors duration-200
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

            {/* ERRORES */}
            {errores && errores.length > 0 && (
                <div className="mt-4 p-4 bg-indigo-200 border border-black rounded-lg flex items-center justify-between">
                    <div className="text-red-700">
                        <p className="font-bold text-left">
                            ⚠️ Se encontraron {errores.length} errores
                        </p>
                        <p className="text-sm">
                            Descarga el reporte para revisarlos manualmente.
                        </p>
                    </div>

                    <button
                        onClick={handleDescargarErrores}
                        className="px-4 py-2 bg-red-600 text-white border border-black font-semibold rounded hover:bg-red-700 transition shadow-sm flex items-center gap-2"
                    >
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

            {/* TABLA */}
            {jsonData.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3 text-white">
                        Datos del CSV
                    </h3>

                    <div className="overflow-x-auto overflow-y-auto max-h-80 rounded-lg shadow border border-black">
                        <table className="w-full text-center border border-gray-300 border-collapse rounded-lg overflow-hidden">
                            <thead className="bg-gray-400 text-black">
                                <tr>
                                    {headers.map((header) => (
                                        <th
                                            key={header}
                                            className="px-4 py-2 font-bold border border-black-400"
                                        >
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody className="text-white">
                                {jsonData.map((row, index) => (
                                    <tr
                                        key={index}
                                        className="even:bg-gray-800 odd:bg-gray-900"
                                    >
                                        {headers.map((header) => (
                                            <td
                                                key={`${index}-${header}`}
                                                className="px-4 py-2 border border-gray-700"
                                            >
                                                {row[header]}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CsvProcessor;
