import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Layout from "./layout/Layout";
import {Home, Intervenciones, Resoluciones, Usuarios} from "./pages";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout/>,
    children: [
      {
        path: '/home',
        element: <Home/>
      },
      {
        path: '/intervenciones',
        element: <Intervenciones/>
      },
      {
        path: '/resoluciones',
        element: <Resoluciones/>
      },
      {
        path: '/usuarios',
        element: <Usuarios/>
      }
    ]
  },
]);

const MainRouter = () => {
    return (
        <RouterProvider router={router} />
    )
}

export default MainRouter