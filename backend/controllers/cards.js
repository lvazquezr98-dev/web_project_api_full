// controllers/cards.js
// Lógica de cada ruta de /cards. Los errores se pasan con next(err)
// al manejador centralizado.

const Card = require('../models/card');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');

// Mismo traductor de errores de Mongoose que en el controlador de usuarios.
const handleMongooseError = (err, next) => {
  if (err.name === 'ValidationError') {
    return next(new BadRequestError(`Se pasaron datos inválidos: ${err.message}`));
  }

  if (err.name === 'CastError') {
    return next(new BadRequestError('El id proporcionado no tiene un formato válido'));
  }

  return next(err);
};

const cardNotFound = () => new NotFoundError('No se ha encontrado ninguna tarjeta con ese id');

// GET /cards -> devuelve todas las tarjetas.
module.exports.getCards = (req, res, next) => Card.find({})
  .then((cards) => res.send(cards))
  .catch(next);

// POST /cards -> crea una tarjeta con name y link del body.
// El owner NO viene del cliente: se toma del token (req.user._id).
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  return Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((err) => handleMongooseError(err, next));
};

// DELETE /cards/:cardId -> elimina una tarjeta propia.
// Primero buscamos la tarjeta y comprobamos quién es su autor: nadie puede
// borrar las tarjetas de otra persona (403).
module.exports.deleteCard = (req, res, next) => Card.findById(req.params.cardId)
  .orFail(cardNotFound)
  .then((card) => {
    if (card.owner.toString() !== req.user._id) {
      throw new ForbiddenError('No puedes eliminar una tarjeta que no te pertenece');
    }

    return card.deleteOne().then(() => res.send(card));
  })
  .catch((err) => handleMongooseError(err, next));

// PUT /cards/:cardId/likes -> da like a una tarjeta.
// $addToSet agrega el _id solo si todavía no está, así no hay likes repetidos.
module.exports.likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .orFail(cardNotFound)
  .then((card) => res.send(card))
  .catch((err) => handleMongooseError(err, next));

// DELETE /cards/:cardId/likes -> quita el like de una tarjeta.
module.exports.dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .orFail(cardNotFound)
  .then((card) => res.send(card))
  .catch((err) => handleMongooseError(err, next));
