import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router";
import { Footer, LoginForm, Navbar } from "../components";
import { Spinner } from "../components/ui/ui";
import { clearErrors, logout, loadUser, loginUser } from "../redux/slices/auth/authSlice";

const Layout = () => {
    const dispatch = useDispatch();
    const { loading, loggingIn, error, user } = useSelector((store) => store.auth);

    useEffect(() => {
        dispatch(loadUser());
    }, [dispatch]);

    // Tema oscuro para toda la app; el login queda claro
    const loggedIn = !!user && Object.keys(user).length > 0;
    useEffect(() => {
        document.documentElement.classList.toggle("theme-dark", loggedIn);
    }, [loggedIn]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center gap-3 text-sm text-muted">
                <Spinner className="h-4 w-4 text-accent" />
                Cargando…
            </div>
        );
    }

    if (!user || Object.keys(user).length === 0) {
        return (
            <LoginForm
                sendSubmit={(values) => dispatch(loginUser(values))}
                loading={loggingIn}
                error={error}
                onClearError={() => error && dispatch(clearErrors())}
            />
        );
    }

    return (
        <div className="flex min-h-screen flex-col">
            <div className="sticky top-0 z-40">
                <Navbar logout={() => dispatch(logout())} user={user} />
            </div>
            <main className="app-content w-full flex-grow">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
