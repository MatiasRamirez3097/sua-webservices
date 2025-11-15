import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    proxy: {
      // Definimos un "apodo" para la API
      '/api-rosario': {
        target: 'https://t-apimgw.rosario.gob.ar', // El dominio real
        changeOrigin: true, // Esto engaña al servidor para que crea que la petición viene de allí mismo
        secure: false,
        rewrite: (path) => path.replace(/^\/api-rosario/, '') // Elimina el apodo antes de enviar
      }
    }
  }
})
