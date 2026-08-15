// errors/ConflictError.js
// 409: conflicto con un recurso que ya existe (correo electrónico duplicado).

class ConflictError extends Error {
  constructor(message = 'El recurso ya existe') {
    super(message);
    this.name = 'ConflictError';
    this.statusCode = 409;
  }
}

module.exports = ConflictError;
