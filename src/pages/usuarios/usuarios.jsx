import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    createUser,
    getUsers,
    updateUser,
    deleteUser,
} from "../../redux/actions/usersActions";
import { Div, H2, Button, Label, Input, Table } from "../../components";
import { sweetAlert } from "../../components/alerts/SweetAlert";

const Usuarios = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [rol, setRol] = useState("lector");
    const [formData, setFormData] = useState({
        name: "",
        surname: "",
        email: "",
        password: "",
    });

    const [editMode, setEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const dispatch = useDispatch();

    const { users, loadingUsers, error } = useSelector(
        (state) => state.usersReducer
    );

    useEffect(() => {
        if (modalOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [modalOpen]);

    useEffect(() => {
        dispatch(getUsers());
    }, [dispatch]);

    const resetForm = () => {
        setFormData({
            name: "",
            surname: "",
            email: "",
            password: "",
        });
        setRol("lector");
        setEditMode(false);
        setEditingId(null);
    };

    const handleDelete = async (id) => {
        const result = await sweetAlert.fire({
            type: "warning",
            title: "Eliminar usuario",
            message: "Esta acción no se puede deshacer.",
            showCancelButton: true,
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar",
        });

        if (!result.isConfirmed) return;

        const res = await dispatch(deleteUser(id));

        if (res.meta.requestStatus === "fulfilled") {
            await sweetAlert.fire({
                type: "success",
                title: "Usuario eliminado",
                message: "El usuario fue eliminado correctamente.",
            });
            dispatch(getUsers());
        } else {
            sweetAlert.fire({
                type: "error",
                title: "Error",
                message: "No se pudo eliminar el usuario.",
            });
        }
    };

    const handleEdit = (user) => {
        setFormData({
            name: user.name,
            surname: user.surname,
            email: user.email,
            password: "",
        });
        setRol(user.role);
        setEditingId(user._id);
        setEditMode(true);
        setModalOpen(true);
    };

    return (
        <Div>
            <H2 label="GESTIÓN DE USUARIOS" />

            {/* Botón crear usuario */}
            <div className="flex justify-center items-center mb-6 px-4">
                <Button
                    text="Crear usuario"
                    className="bg-indigo-800 text-white rounded-xl hover:bg-indigo-700"
                    onClick={() => {
                        resetForm();
                        setModalOpen(true);
                    }}
                />
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto bg-gray-700 p-4 rounded-xl shadow-md">
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
                                    <button
                                        className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg w-24 text-center"
                                        onClick={() => handleEdit(row)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg w-24 text-center"
                                        onClick={() => handleDelete(row._id)}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            ),
                        },
                    ]}
                />
            </div>

            {modalOpen && (
                <div className="fixed inset-0 bg-black/60 z-50">
                    <div className="flex items-center justify-center min-h-screen p-4">
                        <div className="bg-gray-900 w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border border-gray-700 p-6 animate-fadeIn">
                            {/* Título */}
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-white">
                                    {editMode
                                        ? "Editar usuario"
                                        : "Crear nuevo usuario"}
                                </h2>

                                <button
                                    onClick={() => {
                                        resetForm();
                                        setModalOpen(false);
                                    }}
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
                                        <option value="admin">
                                            Administrador
                                        </option>
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
                                                !formData.email
                                            ) {
                                                return sweetAlert.fire({
                                                    type: "warning",
                                                    title: "Campos incompletos",
                                                    message:
                                                        "Nombre, apellido y email son obligatorios.",
                                                });
                                            }

                                            if (
                                                !editMode &&
                                                !formData.password
                                            ) {
                                                return sweetAlert.fire({
                                                    type: "warning",
                                                    title: "Contraseña requerida",
                                                    message:
                                                        "Debe ingresar una contraseña para crear el usuario.",
                                                });
                                            }

                                            if (
                                                formData.password &&
                                                formData.password.length < 6
                                            ) {
                                                return sweetAlert.fire({
                                                    type: "warning",
                                                    title: "Contraseña inválida",
                                                    message:
                                                        "La contraseña debe tener al menos una mayuscula, una minuscula, un numero, un caracter especial y un minimo de 8 caracteres.",
                                                });
                                            }

                                            const userData = {
                                                ...formData,
                                                role: rol,
                                            };
                                            let res;

                                            if (editMode) {
                                                // UPDATE
                                                res = await dispatch(
                                                    updateUser({
                                                        id: editingId,
                                                        data: userData,
                                                    })
                                                );
                                            } else {
                                                // CREATE
                                                res = await dispatch(
                                                    createUser(userData)
                                                );
                                            }

                                            if (
                                                res.meta.requestStatus ===
                                                "fulfilled"
                                            ) {
                                                await sweetAlert.fire({
                                                    type: "success",
                                                    title: editMode
                                                        ? "Usuario actualizado"
                                                        : "Usuario creado",
                                                    message: editMode
                                                        ? "Los cambios se guardaron correctamente."
                                                        : "El usuario fue creado con éxito.",
                                                });

                                                dispatch(getUsers());
                                                resetForm();
                                                setModalOpen(false);
                                            } else {
                                                sweetAlert.fire({
                                                    type: "error",
                                                    title: "Error",
                                                    message:
                                                        "No se pudo procesar la solicitud.",
                                                });
                                            }
                                        } catch (e) {
                                            console.error(e);
                                            sweetAlert.fire({
                                                type: "error",
                                                title: "Error inesperado",
                                                message:
                                                    "Ocurrió un error al procesar la operación.",
                                            });
                                        }
                                    }}
                                    className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-all shadow-md"
                                >
                                    <span>
                                        {editMode
                                            ? "Guardar cambios"
                                            : "Crear usuario"}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Div>
    );
};

export default Usuarios;
