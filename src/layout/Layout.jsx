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
            <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
                Cargando...
            </div>
        );
    }

    if (!user || Object.keys(user).length === 0) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
                <div className="w-full max-w-md bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-10">
                    <LoginForm
                        sendSubmit={(values) => dispatch(loginUser(values))}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-900 text-white">
            <div className="sticky top-0 z-50">
                <Navbar logout={() => dispatch(logout())} user={user} />
            </div>
            <main className="flex-grow px-4 py-6">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
