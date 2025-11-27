import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Layout from "./layout/Layout";
import { Home, Intervenciones, Resoluciones } from "./pages";
import { ProtectedRoute } from "./components";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "/home",
                element: <Home />,
            },
            {
                element: <ProtectedRoute allowedRoles={["admin", "manager"]} />,
                children: [
                    {
                        path: "/intervenciones",
                        element: <Intervenciones />,
                    },
                    {
                        path: "/resoluciones",
                        element: <Resoluciones />,
                    },
                ],
            },
        ],
    },
]);

const MainRouter = () => {
    return <RouterProvider router={router} />;
};

export default MainRouter;
