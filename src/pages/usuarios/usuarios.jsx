import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createUser, getUsers } from "../../redux/actions/usersActions";
import { Div, H2, Button, Label, Input, Table } from "../../components";

const Usuarios = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [rol, setRol] = useState("lector");
    const [formData, setFormData] = useState({
        name: "",
        surname: "",
        email: "",
        password: "",
    });

    const dispatch = useDispatch();

    const { users, loadingUsers, error } = useSelector(
        (state) => state.usersReducer
    );

    useEffect(() => {
        dispatch(getUsers());
    }, [dispatch]);

    return (
        <Div>
            <H2 label="GESTIÓN DE USUARIOS" />

            {/* Botón crear usuario */}
            <div className="flex justify-center items-center mb-6 px-4">
                <Button
                    text="Crear usuario"
                    className="bg-indigo-800 text-white rounded-xl hover:bg-indigo-700"
                    onClick={() => setModalOpen(true)}
                />
            </div>

            {/* Tabla */}
            <Table
                data={users}
                columns={[
                    { header: "Nombre", key: "name" },
                    { header: "Apellido", key: "surname" },
                    { header: "Email", key: "email" },
                    {
                        header: "Acciones",
                        render: (row) => (
                            <div className="col-span-2 flex justify-center gap-3">
                                <button className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg w-24 text-center">
                                    Editar
                                </button>
                                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg w-24 text-center">
                                    Eliminar
                                </button>
                            </div>
                        ),
                    },
                ]}
            />

            {modalOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-gray-900 w-full max-w-md rounded-2xl shadow-2xl border border-gray-700 p-6 animate-fadeIn">
                        {/* Título */}
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-white">
                                Crear nuevo usuario
                            </h2>

                            <button
                                onClick={() => setModalOpen(false)}
                                className="text-gray-400 hover:text-white transition-all text-xl"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Formulario */}
                        <div className="space-y-4">
                            <div>
                                <Label label="Nombre" />
                                <Input
                                    type="text"
                                    placeholder="Ingrese nombre"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            name: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <Label label="Apellido" />
                                <Input
                                    type="text"
                                    placeholder="Ingrese apellido"
                                    value={formData.surname}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            surname: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <Label label="Email" />
                                <Input
                                    type="email"
                                    placeholder="usuario@correo.com"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            email: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <Label label="Contraseña" />
                                <Input
                                    type="password"
                                    placeholder="Mínimo 6 caracteres"
                                    value={formData.password}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            password: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label label="Rol del usuario" />
                                <select
                                    value={rol}
                                    onChange={(e) => setRol(e.target.value)}
                                    className="bg-gray-800 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                >
                                    <option value="admin">Administrador</option>
                                    <option value="manager">Manager</option>
                                    <option value="lector">Lector</option>
                                </select>
                            </div>
                        </div>

                        {/* Botones */}
                        <div className="flex justify-end gap-4 mt-6">
                            <button
                                onClick={() => setModalOpen(false)}
                                className="px-5 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 transition-all"
                            >
                                Cancelar
                            </button>

                            <button
                                onClick={async () => {
                                    try {
                                        if (
                                            !formData.name ||
                                            !formData.surname ||
                                            !formData.email ||
                                            !formData.password
                                        ) {
                                            return alert(
                                                "Por favor complete todos los campos"
                                            );
                                        }
                                        const newUser = {
                                            ...formData,
                                            role: rol,
                                        };

                                        const res = await dispatch(
                                            createUser(newUser)
                                        );

                                        console.log("Usuario creado:", res);

                                        if (
                                            res.meta.requestStatus ===
                                            "fulfilled"
                                        ) {
                                            dispatch(getUsers());

                                            setFormData({
                                                name: "",
                                                surname: "",
                                                email: "",
                                                password: "",
                                            });
                                            setRol("lector");
                                            setModalOpen(false);
                                        }
                                    } catch (error) {
                                        console.error(
                                            "Error al crear usuario:",
                                            error
                                        );
                                        alert("Error al crear usuario");
                                    }
                                }}
                                className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-all shadow-md"
                            >
                                Crear usuario
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Div>
    );
};

export default Usuarios;
