const CsvProcessor = ({
	file,
	jsonData,
	handleFileChange,
	handleParse,
	handleProcessAPI,
	status,
	headers,
	rowStatus
}) => {
	// Función auxiliar para colores
  	const getRowStyle = (index) => {
        // Verificamos si rowStatus existe para evitar errores si es undefined
        if (!rowStatus) return {}; 

        const state = rowStatus[index];
        if (state === 'success') return { backgroundColor: '#d4edda' }; // Verde
        if (state === 'error') return { backgroundColor: '#f8d7da' };   // Rojo
        
        return {}; // Sin color
    };


	return (
		// Contenedor principal
		<div className="border border-gray-300 p-10 bg-gray-800 min-h-0">

			{/* Título principal */}
			<h2 className="text-2xl font-bold text-white text-center p-15">
				Procesador de CSV
			</h2>

			{/* Sección para subir archivo */}
			<div className="flex flex-col items-center p-5">
                <div className="flex flex-col items-center gap-2">
                    {/*label actua como boton*/}
                    <label htmlFor="file-upload" className="bg-indigo-900 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-indigo-600 transition">
                        Seleccionar archivo
                    </label>
				    {/* Input de archivo, oculto  */}
				    <input
                        id="file-upload"
					    type="file"
					    accept=".csv"
					    onChange={handleFileChange}
					    className="hidden"
				    />
                    {file ? (
                        <p className="p-15 text-sm text-white">{file.name}</p>
                    ) : (
                        <p className="p-15 text-sm text-gray-400 italic">Ningún archivo seleccionado</p>
                    )}
				    {/* Botón de cargar: cambia color si hay archivo */}
				    <button
					    onClick={handleParse}
					    disabled={!file}
					    className={`px-6 py-2 rounded-md text-white font-medium transition-colors duration-200 ${
		                    file
			                    ? "bg-indigo-900 hover:bg-indigo-700 cursor-pointer"
			                    : "bg-gray-700 cursor-not-allowed"
					    }`}
				    >
					    Cargar y Mostrar CSV
				    </button>
                </div>            
			</div>

			{/* Tabla: se muestra solo si hay datos cargados */}
			{jsonData.length > 0 && (
				<div className="mt-6">
					
					{/* Subtítulo de la tabla */}
					<h3 className="text-lg font-semibold mb-3 text-white">
						Datos del CSV
					</h3>

					{/* Contenedor de tabla con scroll horizontal y sombra */}
					<div className="overflow-x-auto rounded-lg shadow">
						<table className="w-full border text-center border-gray-300 border-collapse rounded-lg overflow-hidden">
							
							{/* Encabezados: fondo gris y texto en mayúscula */}
							<thead className="bg-gray-400 text-black">
								<tr>
									{headers.map((header) => (
										<th key={header} className="px-4 py-2 text-center font-bold border border-black-400">
											{header}
										</th>
									))}
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
                                        <td key={`${index}-${header}`} style={{ padding: '8px' }}>
                                            {row[header]}
                                        </td>
                                    ))}
                                    
                                    {/* Columna de estado (ícono) */}
                                    <td style={{ textAlign: 'center' }}>
                                        {rowStatus[index] === 'success' && '✅'}
                                        {rowStatus[index] === 'error' && '❌'}
                                    </td>
                                </tr>
                            ))}
                        	</tbody>
						</table>
					</div>

					{/* Sección inferior: botón de procesar + estado actual */}
					<div className="mt-8 text-center">

						{/* Botón verde para procesar con hover más oscuro */}
						<button
							onClick={handleProcessAPI}
							className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
						>
							Procesar {jsonData.length} filas con la API
						</button>

						{/* Estado de procesamiento: texto gris oscuro */}
						{status && (
							<p className="mt-4 text-gray-800 font-medium">
								<strong>Estado:</strong> {status}
							</p>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default CsvProcessor;
