// errors/ForbiddenError.js
// 403: hay sesión, pero el usuario no tiene permiso sobre ESE recurso
// (por ejemplo, intentar borrar la tarjeta de otra persona).

class ForbiddenError extends Error {
  constructor(message = 'No tienes permiso para realizar esta acción') {
    super(message);
    this.name = 'ForbiddenError';
    this.statusCode = 403;
  }
}

module.exports = ForbiddenError;
