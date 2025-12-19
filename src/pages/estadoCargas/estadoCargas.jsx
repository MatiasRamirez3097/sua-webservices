import { useEffect, useState } from "react";
import { Button, Div, Input, Label, Modal, Table } from "../../components";
import { useDispatch, useSelector } from "react-redux";
import {
    getBatchs,
    getOneBatch,
    newFechaEjecucionAction,
    rescheduleBatch,
} from "../../redux/actions/batchsActions";
import createCSV from "../../utils/createCSV";

const EstadoCargas = () => {
    const dispatch = useDispatch();
    const [modal, setModal] = useState({
        status: false,
        type: null,
    });
    const [idSelected, setIdSelected] = useState(null);
    const { batch, batchs, newFechaEjecucion } = useSelector(
        (store) => store.batchsReducer
    );

    useEffect(() => {
        dispatch(getBatchs());
    }, [dispatch]);

    useEffect(() => {
        const checkActiveProccess = batchs.some(
            (b) => b.status === "PROCESSING" || b.status === "PENDING"
        );
        if (checkActiveProccess) {
            const intervalId = setInterval(() => {
                dispatch(getBatchs());
            }, 3000);

            return () => clearInterval(intervalId);
        }
    }, [batchs, dispatch]);

    const getErrors = async (id) => {
        await dispatch(
            getOneBatch({
                id: id,
                onlyErrors: true,
                fields: "date",
                itemsFields: "sua,year,errorDetail",
            })
        );
        setModal({
            status: true,
            type: "errors",
        });
    };

    const downloadErrors = (errors) => {
        // 3. Crear link de descarga temporal
        const link = document.createElement("a");
        const url = URL.createObjectURL(createCSV(errors));
        link.setAttribute("href", url);
        link.setAttribute("download", "reporte_errores.csv");
        link.style.visibility = "hidden";

        // 4. Simular click y limpiar
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const isEditable = (batch) => {
        if (batch.status !== "PENDING") return false;

        if (!batch.scheduledFor) return false;

        const now = new Date();
        const scheduledTime = new Date(batch.scheduledFor);
        const diff = scheduledTime - now;
        const ONE_HOUR = 60 * 60 * 1000;

        return diff > ONE_HOUR;
    };

    const handleScheduledEdit = (id) => {
        setIdSelected(id);
        setModal({
            status: true,
            type: "reschedule",
        });
    };

    const onChange = (e) => {
        if (e.target.name == "newFechaEjecucion")
            dispatch(newFechaEjecucionAction(e.target.value));
    };

    const sendScheduledChange = async () => {
        await dispatch(
            rescheduleBatch({
                id: idSelected,
                newDate: newFechaEjecucion,
            })
        );
        setModal({
            status: false,
            type: null,
        });
    };

    return (
        <Div className="w-full max-w-8xl mx-auto border border-gray-300 p-6 bg-gray-800 rounded-xl mb-8">
            <Table
                data={batchs}
                columns={[
                    {
                        header: "Fecha",
                        key: "date",
                    },
                    {
                        header: "Tipo",
                        key: "processType",
                    },
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
                    {
                        header: "Solicitudes",
                        key: "totalRecords",
                    },
                    {
                        header: "Procesados",
                        key: "processed",
                    },
                    {
                        header: "Errores",
                        key: "errorsCount",
                    },
                    {
                        header: "Estado",
                        key: "status",
                    },
                    {
                        header: "Progreso",
                        render: (row) => {
                            // Evitamos división por cero
                            const total = row.totalRecords || 1;
                            const processed = row.processed || 0;
                            const percentage = Math.round(
                                (processed / total) * 100
                            );

                            // Color dinámico de la barra
                            let barColor = "bg-blue-600";
                            if (row.status === "ERROR") barColor = "bg-red-500";
                            if (row.status === "COMPLETED")
                                barColor = "bg-green-500";

                            return (
                                <div className="w-32">
                                    {" "}
                                    {/* Ancho fijo para la barra */}
                                    <div className="flex justify-between text-xs mb-1">
                                        <span>{percentage}%</span>
                                        <span className="text-gray-400">
                                            {processed}/{total}
                                        </span>
                                    </div>
                                    {/* Contenedor de la barra (fondo gris) */}
                                    <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
                                        {/* La barra de relleno (animada) */}
                                        <div
                                            className={`${barColor} h-2.5 rounded-full transition-all duration-500 ease-out`}
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
                            <div className="flex justify-center items-center gap-3">
                                {row.status === "PENDING" ? (
                                    <>
                                        {isEditable && (
                                            <Button
                                                className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-xl px-4 py-2 h-20 flex items-center justify-center text-center leading-tight"
                                                text="Cambiar fecha ejecucion"
                                                onClick={() =>
                                                    handleScheduledEdit(row._id)
                                                }
                                            />
                                        )}
                                        <Button
                                            className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl px-4 py-2 h-20 flex items-center justify-center text-center leading-tight"
                                            text="Eliminar"
                                        />
                                    </>
                                ) : row.status === "COMPLETED" &&
                                  row.errorsCount > 0 ? (
                                    <Button
                                        className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl px-4 py-2 h-20 flex items-center justify-center text-center leading-tight"
                                        text="Ver errores"
                                        onClick={() => getErrors(row._id)}
                                    />
                                ) : (
                                    <Button
                                        className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl px-4 py-2 h-20 flex items-center justify-center text-center leading-tight"
                                        text="Ver Resultados"
                                    ></Button>
                                )}
                            </div>
                        ),
                    },
                ]}
            />
            {modal.status && (
                <Modal>
                    {modal.type === "errors" ? (
                        Object.keys(batch).length > 0 && (
                            <Div>
                                <table className="w-full border-collapse border border-gray-700 text-white my-4">
                                    <thead className="bg-gray-700 text-center">
                                        <tr>
                                            <th className="border border-gray-600 px-3 py-2">
                                                FECHA
                                            </th>
                                            <th className="border border-gray-600 px-3 py-2">
                                                Tipo
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="bg-gray-800">
                                            <td className="border border-gray-700 text-center px-3 py-2">
                                                {batch.date}
                                            </td>
                                            <td className="border border-gray-700 text-center px-3 py-2">
                                                {batch.processType}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <Table
                                    data={batch.items}
                                    columns={[
                                        {
                                            header: "SUA",
                                            key: "sua",
                                        },
                                        {
                                            header: "AÑO",
                                            key: "year",
                                        },
                                        {
                                            header: "Error",
                                            key: "errorDetail",
                                        },
                                    ]}
                                />
                                <div className="flex justify-center items-center gap-4 mt-4">
                                    <Button
                                        text="OK"
                                        onClick={() =>
                                            setModal({
                                                status: false,
                                                type: null,
                                            })
                                        }
                                        className="bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg px-4 py-2 flex items-center justify-center"
                                    />

                                    <Button
                                        text="Descargar errores"
                                        onClick={() =>
                                            downloadErrors(batch.items)
                                        }
                                        className="bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg px-4 py-2 flex items-center justify-center whitespace-nowrap"
                                    />
                                </div>
                            </Div>
                        )
                    ) : (
                        <div className="flex-1">
                            <Label label="Fecha y hora ejecucion" />
                            <Input
                                value={newFechaEjecucion}
                                name="newFechaEjecucion"
                                onChange={(e) => onChange(e)}
                                type="datetime-local"
                                step="1"
                            />
                            <div className="flex justify-center items-center gap-4 mt-4">
                                <Button
                                    text="OK"
                                    onClick={() => sendScheduledChange()}
                                    className="bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg px-4 py-2 flex items-center justify-center"
                                />

                                <Button
                                    text="Cancelar"
                                    onClick={() =>
                                        setModal({
                                            status: false,
                                            type: null,
                                        })
                                    }
                                    className="bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg px-4 py-2 flex items-center justify-center whitespace-nowrap"
                                />
                            </div>
                        </div>
                    )}
                </Modal>
            )}
        </Div>
    );
};

export default EstadoCargas;
