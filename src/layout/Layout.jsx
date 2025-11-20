import { Outlet } from "react-router";
import { Footer, Navbar, Modal, Label, Input } from "../components";

const Layout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-900 text-white">
            <Modal>
                <Label label="hola"/>

                    <Label label="hola"/>
                    <Input 
                        name="hola"
                        type="text"
                        placeholder="{placeholder}"
                    />
                    <Label label="hola"/>
                    <Input 
                        name="hola"
                        type="text"
                        placeholder="{placeholder}"
                    />

                <button>
                    <Label label="hola"/>
                </button>
            </Modal>
            <Navbar text="inicio de sesion"/>
            <main className="flex-grow pt-12 pb-12 px-4">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
