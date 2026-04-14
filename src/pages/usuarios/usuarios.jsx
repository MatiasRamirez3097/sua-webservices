import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    getUsers,
    updateUser,
    createUser,
    deleteUser,
} from "../../redux/slices/auth/userSlice";
import { Div, H2, Button, Label, Input, Table } from "../../components";
import { sweetAlert } from "../../components/alerts/SweetAlert";

const AREAS = [
    "Arbolado",
    "Espacios Verdes",
    "Control de Vectores",
    "Escuela de jardineria",
    "Vivero",
    "Taller",
    "Despacho",
    "Paisajismo",
    "Inspeccion",
    "Departamento Tecnico",
    "Centro de Informatica",
];

const PERMISSIONS = [
    { value: "rodados", label: "Rodados" },
    { value: "estadocargas", label: "Estado de Cargas" },
    { value: "resoluciones", label: "Resoluciones" },
    { value: "usuarios", label: "Usuarios" },
];

const ROLES = [
    { value: "admin", label: "Administrador" },
    { value: "manager", label: "Manager" },
    { value: "operator", label: "Operador" },
    { value: "viewer", label: "Visualizador" },
];

// Badge de rol con color
const RoleBadge = ({ role }) => {
    const styles = {
        admin: "bg-red-900 text-red-300 border border-red-700",
        manager: "bg-indigo-900 text-indigo-300 border border-indigo-700",
        operator: "bg-yellow-900 text-yellow-300 border border-yellow-700",
        viewer: "bg-gray-700 text-gray-300 border border-gray-500",
    };
    const labels = {
        admin: "Administrador",
        manager: "Manager",
        operator: "Operador",
        viewer: "Visualizador",
    };
    return (
        <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[role] || styles.viewer}`}
        >
            {labels[role] || role}
        </span>
    );
};

const Usuarios = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        surname: "",
        email: "",
        password: "",
        role: "viewer",
        area: "",
        permissions: [],
    });

    const [editMode, setEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const dispatch = useDispatch();
    const { list } = useSelector((state) => state.users);

    useEffect(() => {
        document.body.style.overflow = modalOpen ? "hidden" : "auto";
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
            role: "viewer",
            area: "",
            permissions: [],
        });
        setEditMode(false);
        setEditingId(null);
    };

    const togglePermission = (value) => {
        setFormData((prev) => ({
            ...prev,
            permissions: prev.permissions.includes(value)
                ? prev.permissions.filter((p) => p !== value)
                : [...prev.permissions, value],
        }));
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
            sweetAlert.fire({
                type: "success",
                title: "Eliminado",
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
            role: user.role || "viewer",
            area: user.area || "",
            permissions: user.permissions || [],
        });
        setEditingId(user._id);
        setEditMode(true);
        setModalOpen(true);
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.surname || !formData.email) {
            return sweetAlert.fire({
                type: "warning",
                title: "Campos incompletos",
                message: "Nombre, apellido y email son obligatorios.",
            });
        }
        if (!editMode && !formData.password) {
            return sweetAlert.fire({
                type: "warning",
                title: "Contraseña requerida",
                message: "Debe ingresar una contraseña.",
            });
        }
        if (formData.password && formData.password.length < 6) {
            return sweetAlert.fire({
                type: "warning",
                title: "Contraseña inválida",
                message: "La contraseña debe tener al menos 6 caracteres.",
            });
        }

        try {
            let res;
            if (editMode) {
                const { name, surname, email, role, area, permissions } =
                    formData;
                res = await dispatch(
                    updateUser({
                        id: editingId,
                        data: {
                            name,
                            surname,
                            email,
                            role,
                            area: area || null,
                            permissions,
                        },
                    }),
                );
            } else {
                res = await dispatch(
                    createUser({ ...formData, area: formData.area || null }),
                );
            }

            if (res.meta.requestStatus === "fulfilled") {
                sweetAlert.fire({
                    type: "success",
                    title: editMode ? "Usuario actualizado" : "Usuario creado",
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
                    message: "No se pudo procesar la solicitud.",
                });
            }
        } catch (e) {
            sweetAlert.fire({
                type: "error",
                title: "Error inesperado",
                message: "Ocurrió un error al procesar la operación.",
            });
        }
    };

    const handleResetPassword = async (id) => {
        const { value: newPassword } = await sweetAlert.fire({
            type: "info",
            title: "Restablecer contraseña",
            message: "Ingresá la nueva contraseña para el usuario.",
            input: "password",
            inputPlaceholder: "Nueva contraseña",
            showCancelButton: true,
            confirmButtonText: "Guardar",
            cancelButtonText: "Cancelar",
        });

        if (!newPassword) return;

        if (newPassword.length < 6) {
            return sweetAlert.fire({
                type: "warning",
                title: "Contraseña inválida",
                message: "La contraseña debe tener al menos 6 caracteres.",
            });
        }

        try {
            const res = await dispatch(
                updateUser({
                    id,
                    data: { password: newPassword },
                }),
            );

            if (res.meta.requestStatus === "fulfilled") {
                sweetAlert.fire({
                    type: "success",
                    title: "Contraseña actualizada",
                    message: "La contraseña fue restablecida correctamente.",
                });
            } else {
                sweetAlert.fire({
                    type: "error",
                    title: "Error",
                    message: "No se pudo restablecer la contraseña.",
                });
            }
        } catch (e) {
            sweetAlert.fire({
                type: "error",
                title: "Error inesperado",
                message: "Ocurrió un error al procesar la operación.",
            });
        }
    };

    return (
        <Div className="w-full max-w-6xl mx-auto border border-gray-700 p-6 bg-gray-800 rounded-xl">
            <div className="border-b border-gray-700 pb-4 mb-6">
                <H2
                    className="text-2xl font-bold text-white tracking-widest uppercase"
                    label="Gestión de Usuarios"
                />
                <p className="text-gray-400 text-sm mt-1">
                    Administración de accesos y permisos del sistema
                </p>
            </div>

            <div className="flex justify-end mb-4">
                <Button
                    text="+ Crear usuario"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl px-5 py-2 transition-all"
                    onClick={() => {
                        resetForm();
                        setModalOpen(true);
                    }}
                />
            </div>

            <Table
                data={list}
                columns={[
                    {
                        header: "Nombre",
                        render: (row) => `${row.name} ${row.surname}`,
                    },
                    { header: "Email", key: "email" },
                    {
                        header: "Rol",
                        render: (row) => <RoleBadge role={row.role} />,
                    },
                    {
                        header: "Área",
                        render: (row) => (
                            <span className="text-gray-300 text-sm">
                                {row.area || (
                                    <span className="text-gray-500">
                                        Sin área
                                    </span>
                                )}
                            </span>
                        ),
                    },
                    {
                        header: "Permisos",
                        render: (row) => (
                            <div className="flex flex-wrap gap-1 justify-center">
                                {row.permissions?.length > 0 ? (
                                    row.permissions.map((p) => (
                                        <span
                                            key={p}
                                            className="px-2 py-0.5 bg-indigo-900 text-indigo-300 border border-indigo-700 rounded-full text-xs"
                                        >
                                            {p}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-gray-500 text-xs">
                                        Sin permisos
                                    </span>
                                )}
                            </div>
                        ),
                    },
                    {
                        header: "Acciones",
                        render: (row) => (
                            <div className="flex justify-center gap-2">
                                <button
                                    className="bg-yellow-500 hover:bg-yellow-400 text-black px-3 py-1.5 rounded-lg text-sm font-semibold transition-all"
                                    onClick={() => handleEdit(row)}
                                >
                                    Editar
                                </button>

                                <button
                                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-all"
                                    onClick={() => handleResetPassword(row._id)}
                                >
                                    Contraseña
                                </button>

                                <button
                                    className="bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-all"
                                    onClick={() => handleDelete(row._id)}
                                >
                                    Eliminar
                                </button>
                            </div>
                        ),
                    },
                ]}
            />

            {/* MODAL */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-900 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border border-gray-700 p-6">
                        {/* Header modal */}
                        <div className="flex justify-between items-center border-b border-gray-700 pb-4 mb-5">
                            <div>
                                <h2 className="text-xl font-semibold text-white">
                                    {editMode
                                        ? "Editar usuario"
                                        : "Crear nuevo usuario"}
                                </h2>
                                <p className="text-gray-400 text-sm mt-0.5">
                                    {editMode
                                        ? "Modificá los datos del usuario"
                                        : "Completá los datos para crear el usuario"}
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    resetForm();
                                    setModalOpen(false);
                                }}
                                className="text-gray-400 hover:text-white text-xl transition-all"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Nombre y Apellido */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label label="Nombre" />
                                    <Input
                                        type="text"
                                        placeholder="Nombre"
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
                                        placeholder="Apellido"
                                        value={formData.surname}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                surname: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            {/* Email */}
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

                            {/* Contraseña solo en creación */}
                            {!editMode && (
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
                            )}

                            {/* Rol y Área */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1">
                                    <Label label="Rol" />
                                    <select
                                        value={formData.role}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                role: e.target.value,
                                            })
                                        }
                                        className="bg-gray-800 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        {ROLES.map((r) => (
                                            <option
                                                key={r.value}
                                                value={r.value}
                                            >
                                                {r.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <Label label="Área" />
                                    <select
                                        value={formData.area}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                area: e.target.value,
                                            })
                                        }
                                        className="bg-gray-800 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="">Sin área</option>
                                        {AREAS.map((a) => (
                                            <option key={a} value={a}>
                                                {a}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Permisos */}
                            <div>
                                <Label label="Permisos de acceso" />
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    {PERMISSIONS.map((p) => (
                                        <label
                                            key={p.value}
                                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all
                                                ${
                                                    formData.permissions.includes(
                                                        p.value,
                                                    )
                                                        ? "bg-indigo-900 border-indigo-500 text-indigo-300"
                                                        : "bg-gray-800 border-gray-600 text-gray-400 hover:border-gray-400"
                                                }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={formData.permissions.includes(
                                                    p.value,
                                                )}
                                                onChange={() =>
                                                    togglePermission(p.value)
                                                }
                                                className="accent-indigo-500"
                                            />
                                            <span className="text-sm font-medium">
                                                {p.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Botones */}
                        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-700">
                            <button
                                onClick={() => {
                                    resetForm();
                                    setModalOpen(false);
                                }}
                                className="px-5 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all shadow-md"
                            >
                                {editMode ? "Guardar cambios" : "Crear usuario"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Div>
    );
};

export default Usuarios;
