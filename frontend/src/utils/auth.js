// ============================================================
// auth.js — SOLICITUDES DE REGISTRO Y AUTORIZACIÓN
// ============================================================
// Este módulo agrupa TODAS las peticiones relacionadas con la
// autenticación del usuario contra NUESTRO back-end:
//
//   POST /signup   → registrar un usuario nuevo
//   POST /signin   → autorizar un usuario y recibir su JWT
//   GET  /users/me → comprobar que un JWT sigue siendo válido
//
// Se importa dentro de App.jsx (import * as auth from "../utils/auth")
// porque todas las llamadas a la API viven en el componente raíz,
// no dentro de Login ni de Register.
// ============================================================

import { BASE_URL } from "./config";

export { BASE_URL };

// Encabezados comunes a las tres peticiones.
const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

// Convierte la respuesta en JSON o rechaza la promesa con el mensaje que
// mandó el servidor, para que App.jsx pueda mostrarlo en el InfoTooltip.
function handleResponse(res) {
  if (res.ok) {
    return res.json();
  }

  // Nuestro back-end responde SIEMPRE con { message: "..." } cuando algo
  // falla; si por lo que sea no llega JSON, usamos el código de estado.
  return res
    .json()
    .catch(() => ({}))
    .then((data) => Promise.reject(new Error(data.message || `Error: ${res.status}`)));
}

// Registra un usuario nuevo. Respuesta: el usuario creado (sin contraseña).
export const register = (email, password) => {
  return fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers,
    body: JSON.stringify({ email, password }),
  }).then(handleResponse);
};

// Autoriza al usuario. Respuesta: { token: "..." }
export const authorize = (email, password) => {
  return fetch(`${BASE_URL}/signin`, {
    method: "POST",
    headers,
    body: JSON.stringify({ email, password }),
  }).then(handleResponse);
};

// Comprueba la validez del token y devuelve los datos del usuario
// (entre ellos el correo, que se muestra en el encabezado).
export const checkToken = (token) => {
  return fetch(`${BASE_URL}/users/me`, {
    method: "GET",
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  }).then(handleResponse);
};
