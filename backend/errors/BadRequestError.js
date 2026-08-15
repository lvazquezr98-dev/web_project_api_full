// errors/BadRequestError.js
// 400: los datos que llegaron del cliente no son válidos.

class BadRequestError extends Error {
  constructor(message = 'Se pasaron datos inválidos') {
    super(message);
    this.name = 'BadRequestError';
    this.statusCode = 400;
  }
}

module.exports = BadRequestError;
