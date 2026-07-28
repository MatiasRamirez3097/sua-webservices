import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Layout from "./layout/Layout";
import { EstadoCargas, Home, GestionSua, Rodados, Usuarios } from "./pages";
import { ProtectedRoute } from "./components";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/home",
                element: <Home />,
            },
            {
                element: <ProtectedRoute module="rodados" />,
                children: [{ path: "/rodados", element: <Rodados /> }],
            },
            {
                element: <ProtectedRoute module="estadocargas" />,
                children: [
                    { path: "/estadocargas", element: <EstadoCargas /> },
                ],
            },
            {
                element: <ProtectedRoute module="gestionsua" />,
                children: [{ path: "/gestionsua", element: <GestionSua /> }],
            },
            {
                element: <ProtectedRoute adminOnly />,
                children: [{ path: "/usuarios", element: <Usuarios /> }],
            },
        ],
    },
]);

const MainRouter = () => {
    return <RouterProvider router={router} />;
};

export default MainRouter;
