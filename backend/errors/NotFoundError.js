// errors/NotFoundError.js
// 404: el recurso solicitado no existe.

class NotFoundError extends Error {
  constructor(message = 'Recurso no encontrado') {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

module.exports = NotFoundError;
