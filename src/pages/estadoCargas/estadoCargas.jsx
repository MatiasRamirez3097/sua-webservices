import { useEffect, useState } from "react";
import { Button, Div, Input, Label, Modal, Table, H2 } from "../../components";
import { useDispatch, useSelector } from "react-redux";
import {
    getBatches,
    getOneBatch,
    rescheduleBatch,
    deleteOneBatch,
    setNewExecutionDate,
} from "../../redux/slices/sua/batchSlice.js";
import createCSV from "../../utils/createCSV";

const EstadoCargas = () => {
    const dispatch = useDispatch();
    const [modal, setModal] = useState({
        status: false,
        type: null,
    });
    const [idSelected, setIdSelected] = useState(null);

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

    const isEditable = (batch) => {
        if (batch.status !== "PENDING") return false;
        if (!batch.scheduledAt) return false;

        const now = new Date();
        const scheduledTime = new Date(batch.scheduledAt);
        const diff = scheduledTime - now;
        const ONE_HOUR = 60 * 60 * 1000;

        return diff > ONE_HOUR;
    };

    const handleDelete = (id) => {
        setIdSelected(id);
        setModal({
            status: true,
            type: "delete",
        });
    };

    const sendDelete = async () => {
        await dispatch(deleteOneBatch(idSelected));
        await dispatch(getBatches());
        setModal({ status: false, type: null });
    };

    const handleScheduledEdit = (id) => {
        setIdSelected(id);
        setModal({
            status: true,
            type: "reschedule",
        });
    };

    const onChange = (e) => {
        if (e.target.name === "newExecutionDate")
            dispatch(setNewExecutionDate(e.target.value));
    };

    const sendScheduledChange = async () => {
        await dispatch(
            rescheduleBatch({
                id: idSelected,
                newDate: newExecutionDate,
            }),
        );
        setModal({ status: false, type: null });
    };

    return (
        <Div className="w-full max-w-8xl mx-auto border border-gray-300 p-6 bg-gray-800 rounded-xl mb-8">
            <div className="mb-6">
                <H2
                    className="text-3xl font-bold text-white text-center"
                    label="ESTADO DE CARGAS"
                />
            </div>

            <Table
                data={list}
                columns={[
                    { header: "Fecha", key: "date" },
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
                    { header: "Estado", key: "status" },
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
                                {row.status === "PENDING" &&
                                    isEditable(row) && (
                                        <Button
                                            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-xl px-4 py-2"
                                            text="Cambiar fecha ejecucion"
                                            onClick={() =>
                                                handleScheduledEdit(row._id)
                                            }
                                        />
                                    )}

                                {row.status === "PENDING" && (
                                    <Button
                                        className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl px-4 py-2"
                                        text="Eliminar"
                                        onClick={() => handleDelete(row._id)}
                                    />
                                )}

                                {row.status === "COMPLETED" &&
                                    (row.errorsCount > 0 ? (
                                        <Button
                                            className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-xl px-4 py-2"
                                            text="Ver errores"
                                            onClick={() => getErrors(row._id)}
                                        />
                                    ) : (
                                        <Button
                                            className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl px-4 py-2"
                                            text="Ver Resultados"
                                        />
                                    ))}
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
                            <Table
                                data={batch.items}
                                columns={[
                                    { header: "SUA", key: "sua" },
                                    { header: "AÑO", key: "year" },
                                    { header: "Error", key: "errorDetail" },
                                ]}
                            />

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

                    {modal.type === "reschedule" && (
                        <Div>
                            <Label label="¿Seguro que quieres cambiar la fecha de ejecución?" />

                            <div className="flex justify-center gap-4 mt-4">
                                <Button
                                    className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl px-4 py-2 flex items-center justify-center text-center"
                                    text="Si seguro"
                                />
                                <Button
                                    className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl px-4 py-2 flex items-center justify-center text-center"
                                    text="Cancelar"
                                    onClick={() =>
                                        setModal({ status: false, type: null })
                                    }
                                />
                            </div>
                        </Div>
                    )}

                    {modal.type === "delete" && (
                        <Div>
                            <Label label="¿Seguro que querés eliminar?" />

                            <div className="flex justify-center gap-4 mt-4">
                                <Button
                                    className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl px-4 py-2 flex items-center justify-center text-center"
                                    text="Si seguro"
                                    onClick={sendDelete}
                                />
                                <Button
                                    className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl px-4 py-2 flex items-center justify-center text-center"
                                    text="Cancelar"
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
