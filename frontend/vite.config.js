// ============================================================
// vite.config.js — CONFIGURACIÓN DE VITE
// ============================================================
// Vite es el "empaquetador" (bundler) que usamos en vez de Webpack.
// Es más rápido y más simple de configurar.
//
// ¿Qué hace este archivo?
// - plugins: [react()] → Le dice a Vite que estamos usando React
// - server.port: 5173 → El puerto 3000 ya lo ocupa nuestro back-end
//   (backend/app.js), así que el front-end se queda con el de Vite.
// ============================================================

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});
