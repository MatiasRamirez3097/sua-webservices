import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    getUsers,
    updateUser,
    createUser,
    deleteUser,
} from "../../redux/slices/auth/userSlice";
import { Div, H2, Button, Table, ModalRegister } from "../../components";

const Usuarios = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const dispatch = useDispatch();
    const { list } = useSelector((state) => state.users);

    useEffect(() => {
        dispatch(getUsers());
    }, [dispatch]);

    const handleEdit = (user) => {
        setEditingId(user._id);
        setEditMode(true);
        setModalOpen(true);
    };

    const handleCreate = () => {
        setEditingId(null);
        setEditMode(false);
        setModalOpen(true);
    };

    return (
        <Div>
            <H2 label="GESTIÓN DE USUARIOS" />

            <div className="flex justify-center mb-6">
                <Button
                    text="Crear usuario"
                    className="bg-indigo-800 text-white rounded-xl hover:bg-indigo-700 px-6 py-2"
                    onClick={handleCreate}
                />
            </div>

            <div className="overflow-x-auto bg-gray-800 p-6 rounded-2xl shadow-lg">
                <Table
                    data={list}
                    columns={[
                        { header: "Nombre", key: "name" },
                        { header: "Apellido", key: "surname" },
                        { header: "Email", key: "email" },
                        {
                            header: "Acciones",
                            render: (row) => (
                                <div className="flex justify-center gap-3">
                                    <button
                                        className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg"
                                        onClick={() => handleEdit(row)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                                        onClick={() =>
                                            dispatch(deleteUser(row._id))
                                        }
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            ),
                        },
                    ]}
                />
            </div>

            <ModalRegister
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                editMode={editMode}
                editingId={editingId}
                createUser={createUser}
                updateUser={updateUser}
                getUsers={getUsers}
            />
        </Div>
    );
};

export default Usuarios;
