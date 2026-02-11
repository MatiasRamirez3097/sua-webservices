import { useEffect, useState } from "react"; // 1. Importar hooks
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router";
import { Footer, LoginForm, Modal, Navbar } from "../components";
import { logout, loadUser, loginUser } from "../redux/slices/auth/authSlice";
import { ls } from "../utils/ls";

const Layout = () => {
    const dispatch = useDispatch();
    const { loading, user } = useSelector((store) => store.auth);

    // 3. Este useEffect corre solo UNA vez al recargar la página
    useEffect(() => {
        const initAuth = async () => {
            await dispatch(loadUser());
        };

        initAuth();
    }, [dispatch]); // Array vacío para que corra solo al montar

    // 4. Si está cargando (verificando localStorage), mostramos nada o un spinner
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
                Cargando...
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-900 text-white">
            {Object.keys(user).length == 0 && (
                <Modal>
                    <LoginForm
                        sendSubmit={(values) => dispatch(loginUser(values))}
                    />
                </Modal>
            )}
            <Navbar logout={() => dispatch(logout())} user={user} />
            <main className="flex-grow pt-12 pb-12 px-4">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
