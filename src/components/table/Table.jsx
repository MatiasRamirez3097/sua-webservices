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
        <div className="w-full rounded-lg shadow border border-gray-700 mt-6 overflow-x-auto overflow-y-auto max-h-[70vh]">
            <table className="w-full min-w-max border text-center border-gray-600 border-collapse text-white">
                <thead className="bg-gray-700 text-gray-300 border-b border-gray-600 sticky top-0 z-10">
                    <tr>
                        {columns.map((col) => (
                            <th
                                key={col.key || col.header}
                                className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider border-x border-gray-600 whitespace-nowrap"
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
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
                                    className="px-3 py-2 border-x border-gray-700 text-center text-sm whitespace-nowrap"
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
