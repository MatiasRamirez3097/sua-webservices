import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Label, Input } from "../../components";

const ModalRegister = ({
    isOpen,
    onClose,
    editMode,
    editingId,
    createUser,
    updateUser,
    getUsers,
}) => {
    const dispatch = useDispatch();
    const { list } = useSelector((state) => state.users);

    const [rol, setRol] = useState("lector");
    const [formData, setFormData] = useState({
        name: "",
        surname: "",
        email: "",
        password: "",
    });

    useEffect(() => {
        if (editMode && editingId) {
            const user = list.find((u) => u._id === editingId);
            if (user) {
                setFormData({
                    name: user.name,
                    surname: user.surname,
                    email: user.email,
                    password: "",
                });
                setRol(user.role);
            }
        } else {
            resetForm();
        }
    }, [editMode, editingId]);

    const resetForm = () => {
        setFormData({
            name: "",
            surname: "",
            email: "",
            password: "",
        });
        setRol("lector");
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4">
            <div className="w-full max-w-2xl bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center border-b border-gray-700 pb-4 mb-8">
                    <h2 className="text-2xl font-semibold text-white">
                        {editMode ? "Editar usuario" : "Crear nuevo usuario"}
                    </h2>

                    <button
                        onClick={() => {
                            resetForm();
                            onClose();
                        }}
                        className="text-gray-400 hover:text-white text-2xl"
                    >
                        ✕
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label label="Nombre" />
                        <Input
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
                            value={formData.surname}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    surname: e.target.value,
                                })
                            }
                        />
                    </div>

                    <div className="md:col-span-2">
                        <Label label="Email" />
                        <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    email: e.target.value,
                                })
                            }
                        />
                    </div>

                    {!editMode && (
                        <div className="md:col-span-2">
                            <Label label="Contraseña" />
                            <Input
                                type="password"
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

                    <div className="md:col-span-2">
                        <Label label="Rol del usuario" />
                        <select
                            value={rol}
                            onChange={(e) => setRol(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-600 text-white rounded-lg px-4 py-3"
                        >
                            <option value="admin">Administrador</option>
                            <option value="manager">Manager</option>
                            <option value="lector">Lector</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-end gap-4 mt-10 border-t border-gray-700 pt-6">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 rounded-lg border border-gray-600 text-gray-300"
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={async () => {
                            const userData = { ...formData, role: rol };
                            let res;

                            if (editMode) {
                                res = await dispatch(
                                    updateUser({
                                        id: editingId,
                                        data: userData,
                                    }),
                                );
                            } else {
                                res = await dispatch(createUser(userData));
                            }

                            if (res.meta.requestStatus === "fulfilled") {
                                dispatch(getUsers());
                                resetForm();
                                onClose();
                            }
                        }}
                        className="px-8 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                    >
                        {editMode ? "Guardar cambios" : "Crear usuario"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalRegister;
