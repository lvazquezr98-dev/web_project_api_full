// controllers/users.js
// Lógica de las rutas de usuarios: registro, inicio de sesión y perfil.
//
// Ningún controlador responde errores por su cuenta: todos los pasan con
// next(err) al manejador centralizado de errores que vive en app.js.

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../utils/config');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');

// Traduce los errores de Mongoose al error propio que les corresponde.
// Lo que no reconocemos se deja pasar tal cual: el manejador central
// responderá con un 500.
const handleMongooseError = (err, next) => {
  if (err.name === 'ValidationError') {
    return next(new BadRequestError(`Se pasaron datos inválidos: ${err.message}`));
  }

  if (err.name === 'CastError') {
    return next(new BadRequestError('El id proporcionado no tiene un formato válido'));
  }

  // 11000 es el código de Mongo para un índice único duplicado (email repetido).
  if (err.code === 11000) {
    return next(new ConflictError('Ya existe un usuario registrado con ese correo electrónico'));
  }

  return next(err);
};

// POST /signup -> registra un usuario nuevo.
// La contraseña NUNCA se guarda en claro: se guarda su hash.
module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  // El "salt" de 10 rondas es el valor recomendado por bcrypt: suficientemente
  // lento para un atacante y suficientemente rápido para el servidor.
  return bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      // Respondemos con el usuario SIN el hash de la contraseña.
      const { password: hash, ...userData } = user.toObject();

      return res.status(201).send(userData);
    })
    .catch((err) => handleMongooseError(err, next));
};

// POST /signin -> comprueba el correo y la contraseña y devuelve un JWT.
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // En el payload va SOLO el _id, como pide el proyecto.
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
      });

      // El token viaja en el cuerpo de la respuesta; el cliente lo guarda
      // en el almacenamiento local.
      return res.send({ token });
    })
    // findUserByCredentials ya rechaza con un UnauthorizedError (401).
    .catch(next);
};

// GET /users/me -> devuelve los datos del usuario autenticado.
// El _id lo pone el middleware de autorización en req.user.
module.exports.getCurrentUser = (req, res, next) => User.findById(req.user._id)
  .orFail(() => new NotFoundError('No se ha encontrado ningún usuario con ese id'))
  .then((user) => res.send(user))
  .catch((err) => handleMongooseError(err, next));

// GET /users -> devuelve todos los usuarios.
module.exports.getUsers = (req, res, next) => User.find({})
  .then((users) => res.send(users))
  .catch(next);

// GET /users/:userId -> devuelve un usuario por su _id.
module.exports.getUserById = (req, res, next) => User.findById(req.params.userId)
  // orFail lanza el error cuando no hay resultado, en lugar de responder null.
  .orFail(() => new NotFoundError('No se ha encontrado ningún usuario con ese id'))
  .then((user) => res.send(user))
  .catch((err) => handleMongooseError(err, next));

// PATCH /users/me -> actualiza el perfil del usuario autenticado.
// Solo puede editar SU perfil: el id sale del token, nunca de la petición.
module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;

  return User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true, // devuelve el documento YA actualizado
      runValidators: true, // vuelve a aplicar las validaciones del esquema
    },
  )
    .orFail(() => new NotFoundError('No se ha encontrado ningún usuario con ese id'))
    .then((user) => res.send(user))
    .catch((err) => handleMongooseError(err, next));
};

// PATCH /users/me/avatar -> actualiza solo el avatar del usuario autenticado.
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  return User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail(() => new NotFoundError('No se ha encontrado ningún usuario con ese id'))
    .then((user) => res.send(user))
    .catch((err) => handleMongooseError(err, next));
};
