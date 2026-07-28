import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router";
import { Footer, LoginForm, Navbar } from "../components";
import { logout, loadUser, loginUser } from "../redux/slices/auth/authSlice";

const Layout = () => {
    const dispatch = useDispatch();
    const { loading, user } = useSelector((store) => store.auth);

    useEffect(() => {
        dispatch(loadUser());
    }, [dispatch]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-gray-400 text-sm font-medium tracking-wide">
                    Cargando SUA Webservices...
                </span>
            </div>
        );
    }

    if (!user || Object.keys(user).length === 0) {
        return (
            <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center px-4">
                <div className="w-full max-w-md bg-[#151D30] border border-gray-800 rounded-2xl shadow-2xl p-10">
                    <LoginForm
                        sendSubmit={(values) => dispatch(loginUser(values))}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#0B0F19] text-white antialiased">
            {/* Navbar fija en la parte superior */}
            <div className="sticky top-0 z-50">
                <Navbar logout={() => dispatch(logout())} user={user} />
            </div>

            {/* CONTENEDOR PRINCIPAL: Aquí es donde forzamos la nueva escala del monitor */}
            <main className="flex-grow w-full px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>

            {/* Footer al final de la página */}
            <Footer />
        </div>
    );
};

export default Layout;
