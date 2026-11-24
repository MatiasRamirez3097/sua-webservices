import axios from "axios";

const server = axios.create({
    baseURL: import.meta.env.VITE_ENDPOINT,
    timeout: 60_000,
});

server.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Cuando el backend responde 401 (token vencido, contraseña blanqueada, etc.)
// cerramos la sesión. El handler lo registra main.jsx para no acoplar el store.
let onUnauthorized = null;
export const setUnauthorizedHandler = (fn) => {
    onUnauthorized = fn;
};

server.interceptors.response.use(
    (res) => res,
    (error) => {
        const url = error.config?.url || "";
        const isLogin = url.includes("/auth/signin");
        if (error.response?.status === 401 && !isLogin && onUnauthorized) {
            onUnauthorized();
        }
        return Promise.reject(error);
    },
);

/** Extrae un mensaje legible de un error de axios. */
export const apiErrorMessage = (error, fallback = "Ocurrió un error inesperado.") => {
    const data = error?.response?.data;
    if (typeof data?.error === "string") return data.error;
    if (typeof data?.message === "string") return data.message;
    if (error?.response?.status === 403)
        return "No tenés permisos para realizar esta acción.";
    if (!error?.response) return "No se pudo conectar con el servidor.";
    return fallback;
};

export { server };
