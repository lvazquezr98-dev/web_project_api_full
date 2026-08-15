// middlewares/error-handler.js
// MANEJADOR CENTRALIZADO DE ERRORES.
//
// Es el último middleware de la aplicación y se reconoce porque recibe cuatro
// argumentos. Aquí llegan todos los errores que los controladores pasaron con
// next(err), y es el ÚNICO sitio donde se decide qué responde la API.
//
// Nunca devolvemos el objeto de error tal cual (podría filtrar rutas de
// archivos o consultas a la base de datos): solo un campo message.
//
// El parámetro next no se usa, pero Express necesita los cuatro argumentos
// para reconocer esta función como manejador de errores. Por eso el archivo
// .eslintrc desactiva la regla no-unused-vars para "next".

const { isCelebrateError } = require('celebrate');

module.exports = (err, req, res, next) => {
  // Los errores propios traen su statusCode; el resto son imprevistos -> 500.
  const { statusCode = 500, message } = err;

  // Un JSON malformado en el cuerpo lo marca body-parser así.
  if (err.type === 'entity.parse.failed') {
    return res
      .status(400)
      .send({ message: 'El cuerpo de la petición no es un JSON válido' });
  }

  // Errores de validación de celebrate. No usamos su manejador errors()
  // porque devuelve un objeto con varios campos, y la API debe responder
  // siempre con un único campo message.
  if (isCelebrateError(err)) {
    // err.details es un Map con un detalle por cada parte validada
    // (body, params, query). Nos quedamos con el primer mensaje.
    const [validationError] = Array.from(err.details.values());

    return res.status(400).send({
      message: `Se pasaron datos inválidos: ${validationError.message}`,
    });
  }

  if (statusCode === 500) {
    // Los errores inesperados se registran, pero al cliente solo le llega
    // un mensaje genérico.
    console.error(err);
  }

  return res.status(statusCode).send({
    message: statusCode === 500 ? 'Ha ocurrido un error en el servidor' : message,
  });
};
