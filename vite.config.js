import { defineConfig, loadEnv } from "vite"; // <--- 1. Importamos loadEnv
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
// 2. Cambiamos esto a una FUNCIÓN para recibir el 'mode'
export default defineConfig(({ mode }) => {
    // 3. Cargamos las variables del archivo .env
    const env = loadEnv(mode, process.cwd(), "");

    return {
        plugins: [react(), tailwindcss()],
        server: {
            proxy: {
                // IMPORTANTE: Cambié '/api-rosario' a '/api' para que coincida
                // con lo que configuramos en tu archivo .env (VITE_ENDPOINT=/api).
                "/api": {
                    target: env.VITE_TARGET, // <--- 4. Ahora sí existe la variable 'env'
                    changeOrigin: true,
                    secure: false,
                    rewrite: (path) => path.replace(/^\/api/, ""),
                },
            },
        },
    };
});
