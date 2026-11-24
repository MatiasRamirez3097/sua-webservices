import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { Navigate } from "react-router";
import Layout from "./layout/Layout";
import { EstadoCargas, Home, GestionSua, Rodados, Usuarios } from "./pages";
import { ProtectedRoute } from "./components";
import { PERM } from "./utils/access";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            { index: true, element: <Navigate to="/home" replace /> },
            {
                path: "/home",
                element: <Home />,
            },
            {
                element: <ProtectedRoute perms={[PERM.RODADOS_SOLICITAR, PERM.RODADOS_VER_TODO]} />,
                children: [{ path: "/rodados", element: <Rodados /> }],
            },
            {
                element: <ProtectedRoute perms={[PERM.LOTES_VER]} />,
                children: [
                    { path: "/estadocargas", element: <EstadoCargas /> },
                ],
            },
            {
                element: <ProtectedRoute perms={[PERM.LOTES_CREAR]} />,
                children: [{ path: "/gestionsua", element: <GestionSua /> }],
            },
            {
                element: <ProtectedRoute perms={[PERM.USUARIOS_ADMINISTRAR]} />,
                children: [{ path: "/usuarios", element: <Usuarios /> }],
            },
        ],
    },
]);

const MainRouter = () => {
    return <RouterProvider router={router} />;
};

export default MainRouter;
