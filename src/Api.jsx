import axios from "axios";

const server = axios.create({
    baseURL: import.meta.env.VITE_ENDPOINT,
});

server.interceptors.request.use((config) => {
    // Asegúrate que la key coincida con como lo guardas en el login
    // Puede ser "token" o "auth_token", revisa tu localStorage
    const token = localStorage.getItem("token");

    if (token) {
        // IMPORTANTE: Debe decir "Bearer " + token
        config.headers.Authorization = `Bearer ${token}`;
    } else {
        console.log("⚠️ OJO: No hay token en localStorage");
    }
    return config;
});

export { server };
