const CsvProcessor = ({file,jsonData,handleFileChange,handleParse,handleProcessAPI,status,headers}) => {
	return (
		// Contenedor principal
		<div className="p-8 mt-20 bg-gray-800 min-h-0">

			{/* Título principal */}
			<h2 className="text-2xl font-bold mb-6 text-white text-center">
				Procesador de CSV
			</h2>

			{/* Sección para subir archivo */}
			<div className="flex flex-col items-center gap-4 mt-4">
                <div className="flex flex-col items-center gap-2">
                    {/*label actua como boton*/}
                    <label htmlFor="file-upload" className="bg-indigo-900 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-indigo-600 transition">
                        Seleccionar archivo
                    </label>
				    {/* 📂 Input de archivo, oculto  */}
				    <input
                        id="file-upload"
					    type="file"
					    accept=".csv"
					    onChange={handleFileChange}
					    className="hidden"
				    />
                    {file ? (
                        <p className="p-3 text-sm text-white">{file.name}</p>
                    ) : (
                        <p className="p-3 text-sm text-gray-400 italic">Ningún archivo seleccionado</p>
                    )}
				    {/* 🔘 Botón de cargar: cambia color si hay archivo */}
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

					{/* 🧩 Contenedor de tabla con scroll horizontal y sombra */}
					<div className="overflow-x-auto rounded-lg shadow">
						<table className="w-full border text-center border-gray-300 border-collapse rounded-lg overflow-hidden">
							
							{/* 🧠 Encabezados: fondo gris y texto en mayúscula */}
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
								{jsonData.map((row, rowIndex) => (
									<tr
										key={rowIndex}
										className={`${rowIndex % 2 === 0 ? "bg-gray-100" : "bg-gray-50"}`}
									>
										{headers.map((header) => (
											<td
												key={`${rowIndex}-${header}`} className="px-4 py-2 font-medium text-black border border-black-400"
											>
												{row[header]}
											</td>
										))}
									</tr>
								))}
							</tbody>
						</table>
					</div>

					{/* ⚙️ Sección inferior: botón de procesar + estado actual */}
					<div className="mt-8 text-center">

						{/* 🟢 Botón verde para procesar con hover más oscuro */}
						<button
							onClick={handleProcessAPI}
							className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
						>
							Procesar {jsonData.length} filas con la API
						</button>

						{/* 📡 Estado de procesamiento: texto gris oscuro */}
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
