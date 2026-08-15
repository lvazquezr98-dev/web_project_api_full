// ============================================================
// config.js — DIRECCIÓN BASE DE LA API
// ============================================================
// Un único sitio donde vive la URL del back-end, para que api.js y
// auth.js no puedan quedarse desincronizados.
//
// En desarrollo apunta al servidor local (npm run dev en backend/).
// Para el build de producción se define VITE_API_URL en el archivo
// .env.production del front-end con el subdominio de la API, por ejemplo:
//
//   VITE_API_URL=https://api.tu-dominio.com
//
// Ya no queda ninguna llamada a la API de TripleTen ni a nomoreparties.co:
// todas las peticiones van a nuestro propio servidor.
// ============================================================

export const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

export default BASE_URL;
