// middlewares/logger.js
// Registro de solicitudes y de errores con winston + express-winston.
//
// - requestLogger: guarda TODA petición que llega a la API en request.log.
// - errorLogger:   guarda los errores en error.log.
//
// Los dos escriben en formato JSON, y los archivos .log están en .gitignore
// para que no acaben en el repositorio.

const winston = require('winston');
const expressWinston = require('express-winston');

// Cada línea del archivo es un objeto JSON independiente.
const jsonFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json(),
);

// Va ANTES de las rutas: registra la petición y su respuesta.
const requestLogger = expressWinston.logger({
  transports: [new winston.transports.File({ filename: 'request.log' })],
  format: jsonFormat,
});

// Va DESPUÉS de las rutas y antes del manejador centralizado de errores.
const errorLogger = expressWinston.errorLogger({
  transports: [new winston.transports.File({ filename: 'error.log' })],
  format: jsonFormat,
});

module.exports = { requestLogger, errorLogger };
