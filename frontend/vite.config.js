import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// The Express server keeps its session cookie, so the dev server proxies /api
// to it instead of going cross-origin (no CORS setup needed on the backend).
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        proxy: {
            "/api": {
                target: process.env.VITE_API_TARGET || "http://localhost:8081",
                changeOrigin: true,
            },
        },
    },
});
