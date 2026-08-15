// utils/config.js
// Configuración que cambia entre desarrollo y producción.
//
// En producción (NODE_ENV === 'production') la clave secreta del JWT y la
// dirección de la base de datos SIEMPRE vienen del archivo .env del servidor.
// En desarrollo no hace falta ningún .env: se usan estos valores por defecto,
// tal y como pide el proyecto ("la clave secreta para el desarrollo puede
// almacenarse en el código; está bien").

const { NODE_ENV, JWT_SECRET, MONGO_URL } = process.env;

const isProduction = NODE_ENV === 'production';

module.exports = {
  isProduction,

  // Clave con la que se firman y verifican los tokens.
  JWT_SECRET: isProduction ? JWT_SECRET : 'llave-secreta-de-desarrollo',

  // Tiempo de vida del token: una semana, como pide el proyecto.
  JWT_EXPIRES_IN: '7d',

  // Cadena de conexión a MongoDB.
  MONGO_URL: MONGO_URL || 'mongodb://127.0.0.1:27017/aroundb',

  // Puerto en el que escucha el servidor.
  PORT: process.env.PORT || 3000,
};
