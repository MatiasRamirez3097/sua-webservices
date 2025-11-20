import { useState } from "react";
import { Outlet } from "react-router";
import { Footer, LoginForm, Navbar, Modal, Label, Input } from "../components";

const Layout = () => {
    const [showModal, setShowModal] = useState(false);
    const toggleLogin = () => {
        setShowModal(!showModal);
    };
    return (
        <div className="min-h-screen flex flex-col bg-gray-900 text-white">
            {showModal && (
                <Modal>
                    <LoginForm />
                </Modal>
            )}
            <Navbar toggleLogin={() => toggleLogin()} text="inicio de sesion" />
            <main className="flex-grow pt-12 pb-12 px-4">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
