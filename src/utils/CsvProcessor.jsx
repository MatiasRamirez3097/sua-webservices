const CsvProcessor = ({file, jsonData, handleFileChange, handleParse, handleProcessAPI, status, headers}) => {

    return (
      <div>
        <h2>Procesador de CSV y API</h2>

        {/* --- PASO 1: Subir Archivo --- */}
      <div>
        <input 
          type="file" 
          accept=".csv" 
          onChange={handleFileChange} 
        />
        <button onClick={handleParse} disabled={!file}>
          Cargar y Mostrar CSV
        </button>
      </div>

      {/* --- PASO 2: Mostrar Tabla --- */}
      {jsonData.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3>Datos del CSV</h3>
          <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {headers.map(header => (
                  <th key={header} style={{ padding: '8px' }}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {jsonData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {headers.map(header => (
                    <td key={`${rowIndex}-${header}`} style={{ padding: '8px' }}>
                      {row[header]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* --- PASO 3: Botón de Procesar --- */}
          <div style={{ marginTop: '20px' }}>
            <button onClick={handleProcessAPI}>
              Procesar {jsonData.length} filas con la API
            </button>
            {status && <p><strong>Estado:</strong> {status}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default CsvProcessor;