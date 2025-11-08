import {Outlet} from "react-router";
import {Footer, Navbar} from "../components";

const Layout = () => {
    return (
        <div>
            <Navbar />
            <Outlet />
            <Footer />
        </div>
    )
}

export default Layout;