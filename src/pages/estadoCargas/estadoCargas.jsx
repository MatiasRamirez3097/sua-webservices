import { useEffect, useState } from "react";
import { Button, Div, Modal, Table, H2 } from "../../components";
import { useDispatch, useSelector } from "react-redux";
import {
    getBatches,
    getOneBatch,
    rescheduleBatch,
    deleteOneBatch,
    cancelBatch,
    setNewExecutionDate,
} from "../../redux/slices/sua/batchSlice.js";
import createCSV from "../../utils/createCSV";
import { sweetAlert } from "../../components/alerts/SweetAlert";
import basuraIcon from "../../assets/icons/basura_icon.svg";
import calendarioIcon from "../../assets/icons/calendario_icon.svg";
import cancelarIcon from "../../assets/icons/cancelar_icon.svg";
import confirmacionIcon from "../../assets/icons/confirmacion_icon.svg";
import exclamacionIcon from "../../assets/icons/exclamacion_icon.svg";

const EstadoCargas = () => {
    const dispatch = useDispatch();

    const { batch, list, newExecutionDate } = useSelector(
        (store) => store.batches,
    );

    useEffect(() => {
        dispatch(getBatches());
    }, [dispatch]);

    useEffect(() => {
        const checkActiveProccess = list.some(
            (b) => b.status === "PROCESSING" || b.status === "PENDING",
        );

        if (checkActiveProccess) {
            const intervalId = setInterval(() => {
                dispatch(getBatches());
            }, 3000);

            return () => clearInterval(intervalId);
        }
    }, [list, dispatch]);

    const [modal, setModal] = useState({
        status: false,
        type: null,
    });

    const getErrors = async (id) => {
        await dispatch(
            getOneBatch({
                id: id,
                onlyErrors: true,
                fields: "date",
                itemsFields: "sua,year,errorDetail",
            }),
        );
        setModal({
            status: true,
            type: "errors",
        });
    };

    const downloadErrors = (errors) => {
        const link = document.createElement("a");
        const url = URL.createObjectURL(createCSV(errors));
        link.setAttribute("href", url);
        link.setAttribute("download", "reporte_errores.csv");
        link.style.visibility = "hidden";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getResults = async (id) => {
        await dispatch(
            getOneBatch({
                id: id,
                onlyErrors: false,
                fields: "date",
                itemsFields: "sua,year,status",
            }),
        );

        setModal({
            status: true,
            type: "results",
        });
    };

    const canCancel = (batch) => {
        if (batch.status !== "PENDING") return false;
        if (!batch.scheduledAt) return false;

        const now = new Date();
        const scheduledTime = new Date(batch.scheduledAt);
        const diff = scheduledTime - now;

        const FIFTEEN_MIN = 15 * 60 * 1000;

        return diff > FIFTEEN_MIN;
    };

    const sendDelete = async (id) => {
        const confirm = await sweetAlert.fire({
            type: "question",
            title: "¿Eliminar lote?",
            message: "Esta acción no se puede deshacer.",
            showCancelButton: true,
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar",
        });

        if (!confirm.isConfirmed) return;

        try {
            await dispatch(deleteOneBatch(id)).unwrap();

            dispatch(getBatches());

            sweetAlert.fire({
                type: "success",
                title: "Eliminado",
                message: "El lote fue eliminado correctamente.",
            });
        } catch (error) {
            sweetAlert.fire({
                type: "error",
                title: "Error",
                message: error || "No se pudo eliminar el lote.",
            });
        }
    };

    const handleReschedule = async (id) => {
        const { value: newDate } = await sweetAlert.fire({
            type: "question",
            title: "Nueva fecha de ejecución",
            message: "Ingrese la nueva fecha de ejecución",
            input: "datetime-local",
            inputLabel: "Seleccionar fecha",
            showCancelButton: true,
            confirmButtonText: "Reprogramar",
            cancelButtonText: "Cancelar",
        });

        if (!newDate) return;

        try {
            await dispatch(
                rescheduleBatch({
                    id,
                    newDate,
                }),
            ).unwrap();

            dispatch(getBatches());

            sweetAlert.fire({
                type: "success",
                title: "Reprogramado",
                message: "El lote fue reprogramado a una nueva fecha.",
            });
        } catch (error) {
            sweetAlert.fire({
                type: "error",
                title: "Error",
                message: error || "No se pudo reprogramar.",
            });
        }
    };

    const handleCancel = async (id) => {
        const confirm = await sweetAlert.fire({
            type: "question",
            title: "¿Cancelar lote cargado?",
            message: "El lote cargado pasará a estado cancelado.",
            showCancelButton: true,
            confirmButtonText: "Cancelar",
            cancelButtonText: "Volver",
        });

        if (!confirm.isConfirmed) return;

        try {
            await dispatch(cancelBatch(id)).unwrap();

            dispatch(getBatches());

            sweetAlert.fire({
                type: "success",
                title: "Carga cancelada",
                message: "El lote fue cancelado correctamente.",
            });
        } catch (error) {
            sweetAlert.fire({
                type: "error",
                title: "Error",
                message: error || "No se pudo cancelar.",
            });
        }
    };

    const downloadResults = (results) => {
        const link = document.createElement("a");
        const url = URL.createObjectURL(createCSV(results));
        link.setAttribute("href", url);
        link.setAttribute("download", "reporte_resultados.csv");
        link.style.visibility = "hidden";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="w-full px-2 mb-8">
            {/* HEADER */}
            <div className="mb-6 pb-4 border-b border-gray-700">
                <h1 className="text-2xl font-bold text-white tracking-widest uppercase">
                    Estado de Cargas
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                    Monitoreo de lotes procesados
                </p>
            </div>

            <Table
                data={list}
                columns={[
                    { header: "Fecha", key: "date" },
                    {
                        header: "Fecha ejecución",
                        render: (row) => {
                            if (
                                !row.scheduledAt ||
                                row.scheduledAt.startsWith("1970")
                            ) {
                                return (
                                    <span className="text-gray-500">
                                        Sin programar
                                    </span>
                                );
                            }
                            const date = new Date(row.scheduledAt);
                            return (
                                <span>
                                    {date.toLocaleString("es-AR", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </span>
                            );
                        },
                    },
                    { header: "Tipo", key: "processType" },
                    {
                        header: "Usuario",
                        render: (row) =>
                            !row.user ? (
                                <span className="text-gray-500">
                                    Desconocido
                                </span>
                            ) : (
                                <span className="font-medium text-white">
                                    {row.user.name} {row.user.surname}
                                </span>
                            ),
                    },
                    { header: "Solicitudes", key: "totalRecords" },
                    { header: "Procesados", key: "processed" },
                    { header: "Errores", key: "errorsCount" },
                    {
                        header: "Estado",
                        render: (row) => {
                            const styles = {
                                COMPLETED:
                                    "bg-green-900 text-green-300 border border-green-700",
                                PROCESSING:
                                    "bg-blue-900 text-blue-300 border border-blue-700",
                                PENDING:
                                    "bg-yellow-900 text-yellow-300 border border-yellow-700",
                                CANCELED:
                                    "bg-gray-700 text-gray-300 border border-gray-500",
                                ERROR: "bg-red-900 text-red-300 border border-red-700",
                            };
                            const labels = {
                                COMPLETED: "Completado",
                                PROCESSING: "Procesando",
                                PENDING: "Pendiente",
                                CANCELED: "Cancelado",
                                ERROR: "Error",
                            };
                            return (
                                <span
                                    className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[row.status] || "bg-gray-700 text-gray-300"}`}
                                >
                                    {labels[row.status] || row.status}
                                </span>
                            );
                        },
                    },
                    {
                        header: "Progreso",
                        render: (row) => {
                            const total = row.totalRecords || 1;
                            const processed = row.processed || 0;
                            const percentage = Math.round(
                                (processed / total) * 100,
                            );
                            let barColor = "bg-blue-600";
                            if (row.status === "ERROR") barColor = "bg-red-500";
                            if (row.status === "COMPLETED")
                                barColor = "bg-green-500";
                            return (
                                <div className="w-32">
                                    <div className="flex justify-between text-xs mb-1">
                                        <span>{percentage}%</span>
                                        <span className="text-gray-400">
                                            {processed}/{total}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
                                        <div
                                            className={`${barColor} h-2.5 rounded-full transition-all duration-500`}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                    {row.status === "PROCESSING" && (
                                        <span className="text-[10px] text-blue-400 animate-pulse">
                                            Procesando...
                                        </span>
                                    )}
                                </div>
                            );
                        },
                    },
                    {
                        header: "Acciones",
                        render: (row) => (
                            <div className="flex items-center gap-3">
                                {row.status === "PENDING" && canCancel(row) && (
                                    <div className="relative group">
                                        <button
                                            onClick={() =>
                                                handleCancel(row._id)
                                            }
                                            className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-xl"
                                        >
                                            <img
                                                src={basuraIcon}
                                                className="w-5 h-5"
                                            />
                                        </button>
                                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                            Cancelar
                                        </span>
                                    </div>
                                )}
                                {row.status === "CANCELED" && (
                                    <>
                                        <div className="relative group">
                                            <button
                                                onClick={() =>
                                                    handleReschedule(row._id)
                                                }
                                                className="bg-yellow-500 hover:bg-yellow-600 p-2 rounded-xl"
                                            >
                                                <img
                                                    src={calendarioIcon}
                                                    className="w-5 h-5"
                                                />
                                            </button>
                                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                Cambiar fecha
                                            </span>
                                        </div>
                                        <div className="relative group">
                                            <button
                                                onClick={() =>
                                                    sendDelete(row._id)
                                                }
                                                className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-xl"
                                            >
                                                <img
                                                    src={basuraIcon}
                                                    className="w-5 h-5"
                                                />
                                            </button>
                                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                Eliminar
                                            </span>
                                        </div>
                                    </>
                                )}
                                {row.status === "COMPLETED" && (
                                    <>
                                        {row.processed > row.errorsCount && (
                                            <div className="relative group">
                                                <button
                                                    onClick={() =>
                                                        getResults(row._id)
                                                    }
                                                    className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-xl"
                                                >
                                                    <img
                                                        src={confirmacionIcon}
                                                        className="w-5 h-5"
                                                    />
                                                </button>
                                                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                    Ver resultados
                                                </span>
                                            </div>
                                        )}
                                        {row.errorsCount > 0 && (
                                            <div className="relative group">
                                                <button
                                                    onClick={() =>
                                                        getErrors(row._id)
                                                    }
                                                    className="bg-yellow-600 hover:bg-yellow-700 text-white p-2 rounded-xl"
                                                >
                                                    <img
                                                        src={exclamacionIcon}
                                                        className="w-5 h-5"
                                                    />
                                                </button>
                                                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                    Ver errores
                                                </span>
                                            </div>
                                        )}
                                        <div className="relative group">
                                            <button
                                                onClick={() =>
                                                    sendDelete(row._id)
                                                }
                                                className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-xl"
                                            >
                                                <img
                                                    src={basuraIcon}
                                                    className="w-5 h-5"
                                                />
                                            </button>
                                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                Eliminar
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>
                        ),
                    },
                ]}
            />

            {modal.status && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-900 w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
                        {/* ── ERRORES ── */}
                        {modal.type === "errors" && (
                            <>
                                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
                                    <div>
                                        <h2 className="text-white font-bold text-lg">
                                            Errores del lote
                                        </h2>
                                        <p className="text-gray-400 text-xs mt-0.5">
                                            {batch.items?.length || 0} registros
                                            con error
                                        </p>
                                    </div>
                                    <button
                                        onClick={() =>
                                            setModal({
                                                status: false,
                                                type: null,
                                            })
                                        }
                                        className="text-gray-500 hover:text-white text-xl transition-colors"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div className="flex-1 overflow-auto px-4 py-4">
                                    <Table
                                        data={batch.items}
                                        columns={[
                                            { header: "SUA", key: "sua" },
                                            { header: "Año", key: "year" },
                                            {
                                                header: "Detalle del error",
                                                key: "errorDetail",
                                            },
                                        ]}
                                    />
                                </div>

                                <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-700">
                                    <button
                                        onClick={() =>
                                            downloadErrors(batch.items)
                                        }
                                        className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all"
                                    >
                                        <svg
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                                            <polyline points="7 10 12 15 17 10" />
                                            <line
                                                x1="12"
                                                y1="15"
                                                x2="12"
                                                y2="3"
                                            />
                                        </svg>
                                        Descargar errores
                                    </button>
                                    <button
                                        onClick={() =>
                                            setModal({
                                                status: false,
                                                type: null,
                                            })
                                        }
                                        className="bg-gray-700 hover:bg-gray-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all"
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </>
                        )}

                        {/* ── RESULTADOS ── */}
                        {modal.type === "results" && (
                            <>
                                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
                                    <div>
                                        <h2 className="text-white font-bold text-lg">
                                            Resultados exitosos
                                        </h2>
                                        <p className="text-gray-400 text-xs mt-0.5">
                                            {batch.items?.length || 0} registros
                                            procesados correctamente
                                        </p>
                                    </div>
                                    <button
                                        onClick={() =>
                                            setModal({
                                                status: false,
                                                type: null,
                                            })
                                        }
                                        className="text-gray-500 hover:text-white text-xl transition-colors"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div className="flex-1 overflow-auto px-4 py-4">
                                    <Table
                                        data={batch.items}
                                        columns={[
                                            { header: "SUA", key: "sua" },
                                            { header: "Año", key: "year" },
                                            {
                                                header: "Estado",
                                                render: () => (
                                                    <span className="px-2 py-0.5 bg-green-900 text-green-300 border border-green-700 rounded-full text-xs font-semibold">
                                                        Resuelto con éxito
                                                    </span>
                                                ),
                                            },
                                        ]}
                                    />
                                </div>

                                <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-700">
                                    <button
                                        onClick={() =>
                                            downloadResults(batch.items)
                                        }
                                        className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all"
                                    >
                                        <svg
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                                            <polyline points="7 10 12 15 17 10" />
                                            <line
                                                x1="12"
                                                y1="15"
                                                x2="12"
                                                y2="3"
                                            />
                                        </svg>
                                        Descargar resultados
                                    </button>
                                    <button
                                        onClick={() =>
                                            setModal({
                                                status: false,
                                                type: null,
                                            })
                                        }
                                        className="bg-gray-700 hover:bg-gray-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all"
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EstadoCargas;
