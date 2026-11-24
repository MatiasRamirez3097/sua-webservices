// Formato compartido de lotes (Estado de cargas, Inicio)

export const TYPE_LABELS = {
    RESOLUCION: "Resolución",
    DERIVACION: "Derivación",
    INTERVENCION: "Intervención",
    ASIGNACION: "Asignación",
};

// tone: ver <Status> en components/ui
export const STATUS = {
    PENDING: { label: "Pendiente", tone: "warn" },
    PROCESSING: { label: "Procesando", tone: "accent" },
    COMPLETED: { label: "Completado", tone: "ok" },
    CANCELED: { label: "Cancelado", tone: "neutral" },
    ERROR: { label: "Error", tone: "danger" },
};

/** Estado visible: un lote completado con todos sus registros en error se muestra como error. */
export const batchStatus = (b) => {
    if (b.status === "COMPLETED" && b.totalRecords > 0 && b.errorsCount === b.totalRecords)
        return { label: "Con errores", tone: "danger" };
    if (b.status === "COMPLETED" && b.errorsCount > 0)
        return { label: "Completado con errores", tone: "warn" };
    return STATUS[b.status] ?? { label: b.status, tone: "neutral" };
};

export const formatDateTime = (value) => {
    if (!value || String(value).startsWith("1970")) return null;
    return new Date(value).toLocaleString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
    });
};

// Id de la solicitud (API v2) o, para lotes viejos, "SUA-año"
export const itemRequestId = (item) =>
    item.requestId || (item.sua ? `${item.sua}-${item.year}` : "—");
