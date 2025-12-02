import { useEffect } from "react";
import { Div, Table } from "../../components";
import { useDispatch, useSelector } from "react-redux";
import { getBatchs } from "../../redux/actions/batchsActions";

const EstadoCargas = () => {
    const dispatch = useDispatch();

    const { batchs } = useSelector((store) => store.batchsReducer);

    useEffect(() => {
        dispatch(getBatchs());
        console.log(batchs);
    }, [dispatch]);

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
                            <div className="col-span-2 flex justify-center gap-3">
                                {row.status === "PENDING" ? (
                                    <>
                                        <button className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg w-24 text-center">
                                            Cambiar fecha ejecucion
                                        </button>
                                        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg w-24 text-center">
                                            Eliminar
                                        </button>
                                    </>
                                ) : (
                                    <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg w-24 text-center">
                                        Ver errores
                                    </button>
                                )}
                            </div>
                        ),
                    },
                ]}
            />
        </Div>
    );
};

export default EstadoCargas;
