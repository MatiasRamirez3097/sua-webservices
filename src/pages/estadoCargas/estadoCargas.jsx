import { useEffect, useState } from "react";
import { Button, Div, Modal, Table } from "../../components";
import { useDispatch, useSelector } from "react-redux";
import { getBatchs, getOneBatch } from "../../redux/actions/batchsActions";
import createCSV from "../../utils/createCSV";

const EstadoCargas = () => {
    const dispatch = useDispatch();
    const [modal, setModal] = useState(false);
    const { batch, batchs } = useSelector((store) => store.batchsReducer);

    useEffect(() => {
        dispatch(getBatchs());
    }, [dispatch]);

    const getErrors = async (id) => {
        await dispatch(
            getOneBatch({
                id: id,
                onlyErrors: true,
            })
        );
        setModal(true);
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

    return (
        <Div className="w-full max-w-6xl mx-auto border border-gray-300 p-6 bg-gray-800 rounded-xl mb-8">
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
                        header: "Acciones",
                        render: (row) => (
                            <div className="flex justify-center gap-3">
                                {row.status === "PENDING" ? (
                                    <>
                                        <Button
                                            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-xl px-4 py-2 text-center leading-tight h-[80px] flex items-center justify-center"
                                            text="Cambiar fecha ejecucion"
                                        />
                                        <Button
                                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg w-24 text-center"
                                            text="Eliminar"
                                        />
                                    </>
                                ) : row.status === "COMPLETED" &&
                                  row.errorsCount > 0 ? (
                                    <Button
                                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg w-24 text-center"
                                        text="Ver errores"
                                        onClick={() => getErrors(row._id)}
                                    />
                                ) : (
                                    <Button
                                        className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg w-24 text-center"
                                        text="Ver Resultados"
                                    ></Button>
                                )}
                            </div>
                        ),
                    },
                ]}
            />
            {modal && (
                <Modal>
                    {Object.keys(batch).length > 0 && (
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
                                    onClick={() => setModal(false)}
                                    className="bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg px-4 py-2 flex items-center justify-center"
                                />

                                <Button
                                    text="Descargar errores"
                                    onClick={downloadErrors(batch.items)}
                                    className="bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg px-4 py-2 flex items-center justify-center whitespace-nowrap"
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
