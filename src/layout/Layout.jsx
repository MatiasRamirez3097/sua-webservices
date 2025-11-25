import { useEffect, useState } from "react"; // 1. Importar hooks
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router";
import { Footer, LoginForm, Modal, Navbar } from "../components";
import {
    authenticate,
    logOut,
    setUser,
    signIn,
} from "../redux/actions/usersActions";
import { ls } from "../utils/ls";

const Layout = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((store) => store.usersReducer);

    const [loading, setLoading] = useState(true);

    // 3. Este useEffect corre solo UNA vez al recargar la página
    useEffect(() => {
        const initAuth = async () => {
            await dispatch(authenticate());
            setLoading(false);
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
                        sendSubmit={(values) => dispatch(signIn(values))}
                    />
                </Modal>
            )}
            <Navbar logout={() => dispatch(logOut())} user={user} />
            <main className="flex-grow pt-12 pb-12 px-4">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
