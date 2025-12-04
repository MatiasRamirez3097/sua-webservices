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
        <div className="overflow-x-auto rounded-lg shadow-lg">
            <table className="w-full text-left text-sm text-gray-300">
                {/* CABECERA */}
                <thead className="bg-gray-700 text-xs uppercase text-gray-100">
                    <tr>
                        {columns.map((col) => (
                            <th
                                key={col.key || col.header}
                                className="px-6 py-3"
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>

                {/* CUERPO */}
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {data.map((row) => (
                        <tr
                            key={row._id}
                            className="hover:bg-gray-700 transition-colors"
                        >
                            {columns.map((col, colIndex) => (
                                <td
                                    key={col.key || colIndex}
                                    className="px-6 py-4"
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
