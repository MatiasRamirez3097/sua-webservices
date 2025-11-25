import { Outlet } from "react-router";
import { Footer, LoginForm, Modal } from "../components";
import NavbarResoluciones from "../components/forms/NavbarResolucionesForm";

const Layout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-900 text-white">
            
            <NavbarResoluciones />
            <main className="flex-grow pt-12 pb-12 px-4">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
