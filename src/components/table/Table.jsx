import React from "react";

const Table = ({ columns, data }) => {
    if (!data || data.length === 0) {
        return (
            <div className="p-4 text-center text-gray-400 bg-gray-800 rounded">
                No hay registros para mostrar.
            </div>
        );
    }

    return (
        <div className="overflow-x-auto overflow-y-auto flex-1 rounded-lg shadow border border-gray-700 mt-6">
            <table className="w-full border text-center border-gray-600 border-collapse rounded-lg overflow-hidden text-white">
                {/* CABECERA */}
                <thead className="bg-gray-400 text-black">
                    <tr>
                        {columns.map((col) => (
                            <th
                                key={col.key || col.header}
                                className="px-4 py-2 text-center font-bold border border-gray-700 uppercase"
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>

                {/* CUERPO */}
                <tbody className="text-white">
                    {data.map((row, index) => (
                        <tr
                            key={row._id ?? index}
                            className={`${
                                index % 2 === 0 ? "bg-gray-800" : "bg-gray-900"
                            } hover:bg-gray-700 transition-colors`}
                        >
                            {columns.map((col, colIndex) => (
                                <td
                                    key={col.key || colIndex}
                                    className="px-4 py-2 border border-gray-700 text-center"
                                >
                                    {col.render
                                        ? col.render(row)
                                        : row[col.key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
