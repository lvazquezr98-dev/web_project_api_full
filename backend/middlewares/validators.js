// middlewares/validators.js
// Validación de los datos de entrada con celebrate (Joi).
//
// Estos middlewares se colocan ANTES de cada controlador: si el cuerpo o los
// parámetros de la petición no coinciden con el esquema, celebrate corta la
// petición y el cliente recibe un error de validación sin que el controlador
// llegue a ejecutarse.

const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

// Validador personalizado para los enlaces. Usamos validator.isURL porque es
// más estricto que el validador URI que trae Joi. 'string.uri' es el mismo
// código de error que devolvería el validador por defecto de Joi.
const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }

  return helpers.error('string.uri');
};

// Los _id de MongoDB son cadenas hexadecimales de 24 caracteres.
const objectId = Joi.string().required().hex().length(24);

// POST /signup
const validateCreateUser = celebrate({
  body: Joi.object().keys({
    // name, about y avatar son OPCIONALES: si no llegan, el esquema de
    // Mongoose les pone su valor por defecto.
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(validateURL),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

// POST /signin
const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

// GET /users/:userId
const validateUserId = celebrate({
  params: Joi.object().keys({
    userId: objectId,
  }),
});

// PATCH /users/me
const validateUpdateProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

// PATCH /users/me/avatar
const validateUpdateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(validateURL),
  }),
});

// POST /cards
const validateCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(validateURL),
  }),
});

// Rutas con :cardId (borrar tarjeta, dar y quitar like).
const validateCardId = celebrate({
  params: Joi.object().keys({
    cardId: objectId,
  }),
});

module.exports = {
  validateCreateUser,
  validateLogin,
  validateUserId,
  validateUpdateProfile,
  validateUpdateAvatar,
  validateCreateCard,
  validateCardId,
};
