import { EmptyState } from "../ui/ui";
import { rise } from "../ui/styles";

/**
 * Tabla de datos. Cada columna puede indicar `align: "right"` (números)
 * y `className` para ajustar el ancho.
 */
const Table = ({ columns, data, empty = "No hay registros para mostrar." }) => {
    if (!data || data.length === 0) return <EmptyState>{empty}</EmptyState>;

    const alignClass = (col) =>
        col.align === "right" ? "text-right tabular" : col.align === "center" ? "text-center" : "text-left";

    return (
        <div className="anim-fade w-full overflow-auto max-h-[70vh] rounded-lg border border-line bg-surface shadow-[0_1px_2px_rgb(24_23_43/0.04)]">
            <table className="w-full border-collapse text-sm text-ink">
                <thead className="sticky top-0 z-10 bg-subtle">
                    <tr>
                        {columns.map((col) => (
                            <th
                                key={col.key || col.header}
                                scope="col"
                                className={`border-b border-line px-4 py-3 text-sm font-medium text-muted whitespace-nowrap ${alignClass(col)} ${col.className ?? ""}`}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (
                        <tr
                            key={row._id ?? index}
                            {...rise(index, "group border-b border-line last:border-b-0 transition-colors hover:bg-accent-soft/50")}
                        >
                            {columns.map((col, colIndex) => (
                                <td
                                    key={col.key || colIndex}
                                    className={`px-4 py-3 align-middle whitespace-nowrap ${alignClass(col)} ${col.className ?? ""}`}
                                >
                                    {col.render ? col.render(row) : row[col.key]}
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
