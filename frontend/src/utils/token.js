// ============================================================
// token.js — MANIPULACIÓN DEL JWT EN EL ALMACENAMIENTO LOCAL
// ============================================================
// El token web JSON (JWT) que devuelve el servidor al iniciar
// sesión se guarda en localStorage para que el usuario no tenga
// que volver a escribir su correo y contraseña en cada visita.
//
// Estas funciones auxiliares centralizan el acceso a localStorage
// y evitan repetir la clave "jwt" por todo el proyecto.
// ============================================================

const TOKEN_KEY = "jwt";

// Guarda el token recibido tras un inicio de sesión exitoso.
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);

// Devuelve el token guardado, o null si no existe.
export const getToken = () => localStorage.getItem(TOKEN_KEY);

// Elimina el token: se llama al cerrar sesión.
export const removeToken = () => localStorage.removeItem(TOKEN_KEY);
