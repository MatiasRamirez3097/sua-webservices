import {Outlet} from "react-router";
import {Footer, Navbar} from "../components";

const Layout = () => {
    return (
        <dix>
            <Navbar />
            <Outlet />
            <Footer />
        </dix>
    )
}

export default Layout;