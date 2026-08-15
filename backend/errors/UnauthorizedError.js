// errors/UnauthorizedError.js
// 401: no hay credenciales válidas (correo o contraseña incorrectos,
// token ausente, manipulado o caducado).

class UnauthorizedError extends Error {
  constructor(message = 'Se requiere autorización') {
    super(message);
    this.name = 'UnauthorizedError';
    this.statusCode = 401;
  }
}

module.exports = UnauthorizedError;
