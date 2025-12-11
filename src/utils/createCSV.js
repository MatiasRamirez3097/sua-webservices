import Papa from "papaparse"; // Importamos papaparse

const createCSV = (data) => {
    const csv = Papa.unparse(data);

    // 2. Crear un Blob (archivo en memoria)
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    return blob;
};

export default createCSV;
