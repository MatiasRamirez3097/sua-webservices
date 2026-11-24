import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import RouterProvider from "./Router.jsx";
import { store } from "./redux/store.js";
import { Provider } from "react-redux";
import { setUnauthorizedHandler } from "./Api.jsx";
import { logout } from "./redux/slices/auth/authSlice.js";
import { sweetAlert } from "./components/alerts/SweetAlert.js";

// Sesión vencida o invalidada desde el backend → volver al login
setUnauthorizedHandler(() => {
    const { user } = store.getState().auth;
    const wasLoggedIn = user && Object.keys(user).length > 0;
    store.dispatch(logout());
    if (wasLoggedIn) {
        sweetAlert.fire({
            type: "info",
            title: "Sesión finalizada",
            message: "Tu sesión expiró. Volvé a iniciar sesión.",
        });
    }
});

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <Provider store={store}>
            <RouterProvider />
        </Provider>
    </StrictMode>,
);
