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
        <Div className="w-full max-w-8xl mx-auto border border-gray-300 p-6 bg-gray-800 rounded-xl mb-8">
            <div className="mb-6 border-b border-gray-700 pb-4">
                <H2
                    className="text-2xl font-bold text-white tracking-widest uppercase"
                    label="Estado de Cargas"
                />
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
                            const formatted = date.toLocaleString("es-AR", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            });

                            return <span>{formatted}</span>;
                        },
                    },
                    { header: "Tipo", key: "processType" },
                    {
                        header: "Usuario",
                        render: (row) => {
                            if (!row.user)
                                return (
                                    <span className="text-gray-500">
                                        Desconocido
                                    </span>
                                );
                            return (
                                <span className="font-medium text-white">
                                    {row.user.name} {row.user.surname}
                                </span>
                            );
                        },
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
                                        ></div>
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
                <Modal>
                    {modal.type === "errors" && (
                        <Div>
                            <H2 label="Errores" />
                            <div className="max-h-96 overflow-y-auto rounded-lg">
                                <Table
                                    data={batch.items}
                                    columns={[
                                        { header: "SUA", key: "sua" },
                                        { header: "AÑO", key: "year" },
                                        { header: "Error", key: "errorDetail" },
                                    ]}
                                />
                            </div>

                            <div className="flex justify-center gap-5 mt-4">
                                <Button
                                    text="Descargar errores"
                                    onClick={() => downloadErrors(batch.items)}
                                    className="bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg px-4 py-2 flex items-center justify-center whitespace-nowrap"
                                />

                                <Button
                                    className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl px-4 py-2 flex items-center justify-center text-center"
                                    text="Cerrar"
                                    onClick={() =>
                                        setModal({ status: false, type: null })
                                    }
                                />
                            </div>
                        </Div>
                    )}

                    {modal.type === "results" && (
                        <Div>
                            <H2 label="Resultados exitosos" />

                            <div className="max-h-96 overflow-y-auto rounded-lg">
                                <Table
                                    data={batch.items}
                                    columns={[
                                        { header: "SUA", key: "sua" },
                                        { header: "AÑO", key: "year" },
                                        { header: "Estado", key: "status" },
                                    ]}
                                />
                            </div>

                            <div className="flex justify-center gap-5 mt-4">
                                <Button
                                    text="Descargar resultados"
                                    onClick={() => downloadResults(batch.items)}
                                    className="bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg px-4 py-2"
                                />

                                <Button
                                    className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl px-4 py-2"
                                    text="Cerrar"
                                    onClick={() =>
                                        setModal({ status: false, type: null })
                                    }
                                />
                            </div>
                        </Div>
                    )}
                </Modal>
            )}
        </Div>
    );
};

export default EstadoCargas;
