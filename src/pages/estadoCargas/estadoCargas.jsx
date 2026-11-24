import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table } from "../../components";
import { Button, Dialog, Page, Status, Tabs } from "../../components/ui/ui";
import {
    getBatches,
    getOneBatch,
    rescheduleBatch,
    deleteOneBatch,
    cancelBatch,
} from "../../redux/slices/sua/batchSlice.js";
import createCSV from "../../utils/createCSV";
import { sweetAlert } from "../../components/alerts/SweetAlert";
import {
    TYPE_LABELS,
    batchStatus,
    formatDateTime,
    itemRequestId,
} from "../../utils/batchFormat";
import { PERM, can, canManageBatch } from "../../utils/access";

const ITEM_FIELDS = "requestId,sua,year,status,errorDetail";
const FIFTEEN_MIN = 15 * 60 * 1000;

const FILTERS = [
    { value: "ALL", label: "Todos" },
    { value: "PENDING", label: "Pendientes" },
    { value: "PROCESSING", label: "Procesando" },
    { value: "COMPLETED", label: "Completados" },
    { value: "CANCELED", label: "Cancelados" },
];

const downloadCsv = (rows, filename) => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(createCSV(rows));
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// Se puede cancelar/reprogramar hasta 15 minutos antes de la ejecución
const isEditable = (b) =>
    b.status === "PENDING" && b.scheduledAt && new Date(b.scheduledAt) - Date.now() > FIFTEEN_MIN;

const ActionLink = ({ children, tone = "accent", ...rest }) => (
    <button
        type="button"
        className={`text-sm font-medium hover:underline ${tone === "danger" ? "text-danger" : "text-accent"}`}
        {...rest}
    >
        {children}
    </button>
);

const EstadoCargas = () => {
    const dispatch = useDispatch();
    const { batch, list, loading } = useSelector((store) => store.batches);
    const { user } = useSelector((store) => store.auth);
    const canDelete = can(user, PERM.LOTES_GESTIONAR_TODOS);
    const [filter, setFilter] = useState("ALL");
    const [detail, setDetail] = useState(null); // "errors" | "results" | null

    useEffect(() => {
        dispatch(getBatches());
    }, [dispatch]);

    // Refresco automático mientras haya lotes en curso
    useEffect(() => {
        const processing = list.some((b) => b.status === "PROCESSING");
        const pending = list.some((b) => b.status === "PENDING");
        if (!processing && !pending) return;
        const id = setInterval(() => dispatch(getBatches()), processing ? 3000 : 30000);
        return () => clearInterval(id);
    }, [list, dispatch]);

    const counts = useMemo(() => {
        const c = { ALL: list.length };
        for (const b of list) c[b.status] = (c[b.status] ?? 0) + 1;
        return c;
    }, [list]);

    const rows = filter === "ALL" ? list : list.filter((b) => b.status === filter);

    const openDetail = async (id, type) => {
        await dispatch(
            getOneBatch({ id, onlyErrors: type === "errors", fields: "date", itemsFields: ITEM_FIELDS }),
        );
        setDetail(type);
    };

    const run = async (action, successTitle, fallbackError) => {
        try {
            await dispatch(action).unwrap();
            dispatch(getBatches());
            sweetAlert.fire({ type: "success", title: successTitle });
        } catch (error) {
            sweetAlert.fire({ type: "error", title: "No se pudo completar", message: error || fallbackError });
        }
    };

    const handleDelete = async (id) => {
        const { isConfirmed } = await sweetAlert.fire({
            type: "warning",
            title: "¿Eliminar el lote?",
            message: "Se borra el lote y sus registros. No se puede deshacer.",
            showCancelButton: true,
            confirmButtonText: "Eliminar",
            cancelButtonText: "Volver",
            danger: true,
        });
        if (isConfirmed) run(deleteOneBatch(id), "Lote eliminado", "No se pudo eliminar el lote.");
    };

    const handleReschedule = async (id) => {
        const { value: newDate } = await sweetAlert.fire({
            type: "question",
            title: "Cambiar fecha de ejecución",
            message: "El lote vuelve a quedar pendiente para la nueva fecha.",
            input: "datetime-local",
            showCancelButton: true,
            confirmButtonText: "Guardar",
            cancelButtonText: "Volver",
        });
        if (newDate) run(rescheduleBatch({ id, newDate }), "Fecha actualizada", "No se pudo reprogramar.");
    };

    const handleCancel = async (id) => {
        const { isConfirmed } = await sweetAlert.fire({
            type: "warning",
            title: "¿Cancelar el lote?",
            message: "No se va a ejecutar. Después podés reprogramarlo o eliminarlo.",
            showCancelButton: true,
            confirmButtonText: "Cancelar lote",
            cancelButtonText: "Volver",
            danger: true,
        });
        if (isConfirmed) run(cancelBatch(id), "Lote cancelado", "No se pudo cancelar.");
    };

    const items = batch?.items ?? [];
    const okCount = items.filter((i) => i.status === "SUCCESS").length;
    const okLabel = batch?.processType === "DERIVACION" ? "Derivada" : "Resuelta";

    return (
        <Page
            title="Estado de cargas"
            description="Lotes agendados y su resultado. Se actualiza solo mientras haya lotes en curso."
            actions={
                <Button size="sm" variant="on-dark" onClick={() => dispatch(getBatches())} loading={loading}>
                    Actualizar
                </Button>
            }
            hero={
                <Tabs
                    dark
                    label="Filtrar por estado"
                    value={filter}
                    onChange={setFilter}
                    tabs={FILTERS.map((f) => ({ ...f, count: counts[f.value] ?? 0 }))}
                />
            }
        >
            <Table
                data={rows}
                empty="No hay lotes en este estado."
                columns={[
                    {
                        header: "Ejecución",
                        render: (row) => (
                            <span className="tabular">{formatDateTime(row.scheduledAt) ?? <span className="text-faint">Sin programar</span>}</span>
                        ),
                    },
                    {
                        header: "Tipo",
                        render: (row) => (
                            <span className="block leading-tight">
                                {TYPE_LABELS[row.processType] || row.processType}
                                <span className="ml-1.5 text-sm text-muted">
                                    {row.processType === "DERIVACION"
                                        ? row.extraData?.idAreaDerivada && `a ${row.extraData.idAreaDerivada}`
                                        : row.idArea}
                                </span>
                                {row.date && (
                                    <span className="mt-0.5 block text-xs tabular text-faint">
                                        Resolución {row.date.slice(0, 16)}
                                    </span>
                                )}
                            </span>
                        ),
                    },
                    {
                        header: "Cargado por",
                        render: (row) =>
                            row.user ? (
                                `${row.user.name} ${row.user.surname}`
                            ) : (
                                <span className="text-faint" title="Usuario eliminado o inexistente">
                                    —
                                </span>
                            ),
                    },
                    { header: "Solicitudes", key: "totalRecords", align: "right" },
                    {
                        header: "Errores",
                        align: "right",
                        render: (row) => (
                            <span className={row.errorsCount > 0 ? "font-medium text-danger" : "text-faint"}>
                                {row.errorsCount ?? 0}
                            </span>
                        ),
                    },
                    {
                        header: "Estado",
                        render: (row) => {
                            if (row.status === "PROCESSING")
                                return (
                                    <span className="inline-flex min-w-36 flex-col gap-1">
                                        <Status tone="accent" live>
                                            Procesando {row.processed ?? 0}/{row.totalRecords}
                                        </Status>
                                        <span className="h-1 overflow-hidden rounded-full bg-accent-soft">
                                            <span
                                                className="bar-shimmer block h-full rounded-full bg-accent transition-[width] duration-700 ease-out"
                                                style={{ width: `${Math.round(((row.processed ?? 0) / (row.totalRecords || 1)) * 100)}%` }}
                                            />
                                        </span>
                                    </span>
                                );
                            const s = batchStatus(row);
                            return (
                                <Status tone={s.tone} live={row.status === "PENDING"}>
                                    {s.label}
                                </Status>
                            );
                        },
                    },
                    {
                        header: <span className="sr-only">Acciones</span>,
                        key: "actions",
                        render: (row) => (
                            <div className="flex items-center justify-end gap-3">
                                {row.status === "COMPLETED" && row.processed > row.errorsCount && (
                                    <ActionLink onClick={() => openDetail(row._id, "results")}>Resultados</ActionLink>
                                )}
                                {row.status === "COMPLETED" && row.errorsCount > 0 && (
                                    <ActionLink onClick={() => openDetail(row._id, "errors")}>Errores</ActionLink>
                                )}
                                {canManageBatch(user, row) && (isEditable(row) || row.status === "CANCELED") && (
                                    <ActionLink onClick={() => handleReschedule(row._id)}>Cambiar fecha</ActionLink>
                                )}
                                {canManageBatch(user, row) && isEditable(row) && (
                                    <ActionLink tone="danger" onClick={() => handleCancel(row._id)}>
                                        Cancelar
                                    </ActionLink>
                                )}
                                {canDelete && (row.status === "CANCELED" ||
                                    (row.status === "COMPLETED" && row.errorsCount === row.totalRecords)) && (
                                    <ActionLink tone="danger" onClick={() => handleDelete(row._id)}>
                                        Eliminar
                                    </ActionLink>
                                )}
                            </div>
                        ),
                    },
                ]}
            />

            {detail && (
                <Dialog
                    width="max-w-2xl"
                    title={detail === "errors" ? "Errores del lote" : "Resultados del lote"}
                    description={
                        detail === "errors"
                            ? `${items.length} solicitudes con error`
                            : `${okCount} de ${items.length} procesadas correctamente`
                    }
                    onClose={() => setDetail(null)}
                    footer={
                        <>
                            <Button onClick={() => setDetail(null)}>Cerrar</Button>
                            <Button
                                variant="primary"
                                onClick={() =>
                                    detail === "errors"
                                        ? downloadCsv(
                                              items.map((i) => ({ id: itemRequestId(i), detalle_error: i.errorDetail || "" })),
                                              "errores_lote.csv",
                                          )
                                        : downloadCsv(
                                              items.map((i) => ({
                                                  id: itemRequestId(i),
                                                  estado: i.status === "SUCCESS" ? "OK" : i.status,
                                                  detalle_error: i.errorDetail || "",
                                              })),
                                              "resultados_lote.csv",
                                          )
                                }
                            >
                                Descargar CSV
                            </Button>
                        </>
                    }
                >
                    <Table
                        data={items}
                        columns={
                            detail === "errors"
                                ? [
                                      { header: "Id solicitud", render: (i) => <span className="font-mono">{itemRequestId(i)}</span> },
                                      {
                                          header: "Detalle",
                                          render: (i) => <span className="whitespace-normal text-muted">{i.errorDetail}</span>,
                                      },
                                  ]
                                : [
                                      { header: "Id solicitud", render: (i) => <span className="font-mono">{itemRequestId(i)}</span> },
                                      {
                                          header: "Resultado",
                                          render: (i) =>
                                              i.status === "SUCCESS" ? (
                                                  <Status tone="ok">{okLabel}</Status>
                                              ) : (
                                                  <span title={i.errorDetail}>
                                                      <Status tone="danger">Error</Status>
                                                  </span>
                                              ),
                                      },
                                  ]
                        }
                    />
                </Dialog>
            )}
        </Page>
    );
};

export default EstadoCargas;
