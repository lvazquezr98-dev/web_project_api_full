// middlewares/auth.js
// Middleware de autorización: protege todas las rutas menos /signin y /signup.
//
// Comprueba el JWT que llega en el encabezado Authorization con el formato
// "Bearer <token>". Si el token es válido, añade su payload a req.user y deja
// pasar la petición; si no lo es, responde 401.

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config');
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Se requiere autorización'));
  }

  // Quitamos el prefijo 'Bearer ' y nos quedamos con el token.
  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    // verify lanza una excepción si el token fue manipulado o ya caducó.
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new UnauthorizedError('El token no es válido o ha caducado'));
  }

  // A partir de aquí, cualquier controlador sabe quién hace la petición.
  req.user = payload;

  return next();
};
