import Papa from "papaparse";

// Nombres de columna aceptados para el id de la solicitud (sin distinguir mayúsculas)
const ID_COLUMNS = ["id", "id_solicitud", "idsolicitud", "solicitud", "nro_solicitud"];

const isValidId = (v) => /^\d+$/.test(v) && Number(v) > 0;

/**
 * Lee un CSV con ids de solicitudes (API SUA v2).
 * Acepta:
 *   - una columna "id" (o alias), con o sin otras columnas
 *   - un archivo de una sola columna sin encabezado (solo números)
 *
 * Resuelve con:
 *   { rows: [{ line, id, status: "ok" | "invalid" | "duplicate" }],
 *     ids: ["123", ...],   // válidos y únicos, listos para enviar
 *     invalidCount, duplicateCount }
 * Rechaza con Error si el archivo no tiene una columna de id reconocible.
 */
export const parseRequestCsv = (file) =>
    new Promise((resolve, reject) => {
        Papa.parse(file, {
            skipEmptyLines: "greedy",
            complete: ({ data }) => {
                if (!data.length) return reject(new Error("El archivo está vacío."));

                const first = data[0].map((h) => String(h ?? "").trim());
                const lower = first.map((h) => h.toLowerCase());

                let colIndex = lower.findIndex((h) => ID_COLUMNS.includes(h));
                let bodyStart = 1;

                if (colIndex === -1) {
                    if (first.length === 1 && isValidId(first[0])) {
                        // Sin encabezado: una sola columna de números
                        colIndex = 0;
                        bodyStart = 0;
                    } else if (lower.includes("sua") || lower.includes("anio")) {
                        return reject(
                            new Error(
                                'El archivo usa el formato anterior (columnas "sua" y "anio"). Ahora se necesita una columna "id" con el id de cada solicitud.',
                            ),
                        );
                    } else {
                        return reject(
                            new Error(
                                'No se encontró la columna "id". El CSV debe tener una columna "id" con el id de cada solicitud.',
                            ),
                        );
                    }
                }

                const seen = new Set();
                const rows = [];
                const ids = [];
                let invalidCount = 0;
                let duplicateCount = 0;

                data.slice(bodyStart).forEach((cols, i) => {
                    const id = String(cols[colIndex] ?? "").trim();
                    const line = i + bodyStart + 1; // línea real del archivo
                    let status = "ok";
                    if (!isValidId(id)) {
                        status = "invalid";
                        invalidCount++;
                    } else if (seen.has(id)) {
                        status = "duplicate";
                        duplicateCount++;
                    } else {
                        seen.add(id);
                        ids.push(id);
                    }
                    rows.push({ line, id, status });
                });

                if (!rows.length)
                    return reject(new Error("El archivo no tiene registros."));

                resolve({ rows, ids, invalidCount, duplicateCount });
            },
            error: () => reject(new Error("No se pudo leer el archivo CSV.")),
        });
    });
