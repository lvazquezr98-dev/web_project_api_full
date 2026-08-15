// models/card.js
// Esquema y modelo de la tarjeta. Nombre del modelo en singular: 'card'.

const mongoose = require('mongoose');
// Usamos el mismo validador de enlaces que el avatar del usuario.
const validator = require('validator');

const cardSchema = new mongoose.Schema({
  // Nombre de la tarjeta: obligatorio, entre 2 y 30 caracteres.
  name: {
    type: String,
    required: [true, 'El campo "name" es obligatorio'],
    minlength: [2, 'El campo "name" debe tener al menos 2 caracteres'],
    maxlength: [30, 'El campo "name" debe tener como máximo 30 caracteres'],
  },

  // Enlace a la imagen: obligatorio y validado con validator.isURL.
  link: {
    type: String,
    required: [true, 'El campo "link" es obligatorio'],
    validate: {
      validator: (value) => validator.isURL(value),
      message: (props) => `${props.value} no es una URL válida`,
    },
  },

  // Autor de la tarjeta: referencia (ObjectId) al modelo 'user'.
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'El campo "owner" es obligatorio'],
  },

  // Lista de usuarios que dieron like. Array de ObjectId, vacío por defecto.
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'user',
    default: [],
  },

  // Fecha de creación: se rellena automáticamente al crear la tarjeta.
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
