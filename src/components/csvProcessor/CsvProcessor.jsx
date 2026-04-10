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
        <div className="space-y-6">
            {/* Título */}
            <div className="border-b border-gray-700 pb-4">
                <h2 className="text-2xl font-bold text-white tracking-widest uppercase">
                    Procesador de CSV
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                    Seleccioná un archivo .csv para cargar y procesar
                </p>
            </div>

            {/* Zona de carga */}
            <div className="flex flex-col items-center gap-4">
                <label
                    htmlFor="file-upload"
                    className="w-full max-w-md h-36 flex flex-col items-center justify-center
                           bg-gray-700 border-2 border-dashed border-indigo-500
                           rounded-xl cursor-pointer hover:bg-gray-600 hover:border-indigo-400 transition-all"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-indigo-400 mb-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                        />
                    </svg>
                    <p className="text-white font-medium text-sm">
                        {file
                            ? file.name
                            : "Hacer clic para seleccionar archivo CSV"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        Solo archivos .csv
                    </p>
                </label>

                <input
                    id="file-upload"
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="hidden"
                />

                <div className="flex gap-4">
                    <button
                        onClick={handleParse}
                        disabled={!file}
                        className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all
                        ${
                            file
                                ? "bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer"
                                : "bg-gray-700 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                        Cargar y mostrar CSV
                    </button>

                    <button
                        onClick={handleProcessAPI}
                        disabled={jsonData.length === 0}
                        className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all
                        ${
                            jsonData.length > 0
                                ? "bg-green-600 hover:bg-green-500 text-white cursor-pointer"
                                : "bg-gray-700 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                        Procesar {jsonData.length} filas
                    </button>
                </div>
            </div>

            {/* Errores */}
            {errores && errores.length > 0 && (
                <div className="p-4 bg-red-900/30 border border-red-700 rounded-xl flex items-center justify-between">
                    <div>
                        <p className="font-semibold text-red-400">
                            ⚠️ Se encontraron {errores.length} errores
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                            Descargá el reporte para revisarlos manualmente.
                        </p>
                    </div>
                    <button
                        onClick={handleDescargarErrores}
                        className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-lg transition flex items-center gap-2"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
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
                        Descargar errores
                    </button>
                </div>
            )}

            {/* Tabla CSV */}
            {jsonData.length > 0 && (
                <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                        Vista previa — {jsonData.length} registros
                    </h3>
                    <div className="overflow-auto max-h-80 rounded-xl border border-gray-700">
                        <table className="min-w-full text-center border-collapse text-white">
                            <thead className="bg-gray-700 text-gray-300 sticky top-0 z-10">
                                <tr>
                                    {headers.map((header) => (
                                        <th
                                            key={header}
                                            className="px-3 py-3 text-xs font-semibold uppercase tracking-wider border-x border-gray-600 whitespace-nowrap"
                                        >
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {jsonData.map((row, index) => (
                                    <tr
                                        key={index}
                                        className={`${index % 2 === 0 ? "bg-gray-800" : "bg-gray-900"} hover:bg-gray-700 transition-colors`}
                                    >
                                        {headers.map((header) => (
                                            <td
                                                key={`${index}-${header}`}
                                                className="px-3 py-2 border-x border-gray-700 text-sm whitespace-nowrap"
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
