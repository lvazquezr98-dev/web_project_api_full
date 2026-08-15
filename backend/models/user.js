// models/user.js
// Esquema y modelo del usuario. Nombre del modelo en singular: 'user'.

const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const UnauthorizedError = require('../errors/UnauthorizedError');

const userSchema = new mongoose.Schema({
  // Correo electrónico: obligatorio, único y validado con el módulo validator.
  // unique NO es un validador, es un índice: si se repite, Mongo devuelve el
  // error 11000 que el controlador traduce a un 409.
  email: {
    type: String,
    required: [true, 'El campo "email" es obligatorio'],
    unique: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: (props) => `${props.value} no es un correo electrónico válido`,
    },
  },

  // Hash de la contraseña. select: false hace que la base de datos NO lo
  // devuelva en las consultas normales, así la API nunca lo expone.
  password: {
    type: String,
    required: [true, 'El campo "password" es obligatorio'],
    select: false,
  },

  // Nombre de usuario: opcional, con valor por defecto.
  name: {
    type: String,
    default: 'Jacques Cousteau',
    minlength: [2, 'El campo "name" debe tener al menos 2 caracteres'],
    maxlength: [30, 'El campo "name" debe tener como máximo 30 caracteres'],
  },

  // Información sobre el usuario: opcional, con valor por defecto.
  about: {
    type: String,
    default: 'Explorador',
    minlength: [2, 'El campo "about" debe tener al menos 2 caracteres'],
    maxlength: [30, 'El campo "about" debe tener como máximo 30 caracteres'],
  },

  // Enlace al avatar: opcional, con valor por defecto y validado con validator.
  avatar: {
    type: String,
    default: 'https://practicum-content.s3.us-west-1.amazonaws.com/resources/moved_avatar_1604080799.jpg',
    validate: {
      validator: (value) => validator.isURL(value),
      message: (props) => `${props.value} no es una URL válida`,
    },
  },
});

// Método propio del modelo para la autenticación.
// Busca al usuario por correo pidiendo explícitamente el hash con select('+password')
// y compara la contraseña recibida. Devolvemos el MISMO error tanto si el correo
// no existe como si la contraseña no coincide: así nadie puede averiguar qué
// correos están registrados probando el formulario.
userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(
          new UnauthorizedError('Correo electrónico o contraseña incorrectos'),
        );
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new UnauthorizedError('Correo electrónico o contraseña incorrectos'),
          );
        }

        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
