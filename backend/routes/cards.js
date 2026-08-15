// routes/cards.js
// Rutas que empiezan con /cards. Todas protegidas por el middleware de
// autorización, que se aplica al montar el enrutador en app.js.

const express = require('express');

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const {
  validateCreateCard,
  validateCardId,
} = require('../middlewares/validators');

const router = express.Router();

// GET /cards -> todas las tarjetas
router.get('/', getCards);

// POST /cards -> crear una tarjeta
router.post('/', validateCreateCard, createCard);

// DELETE /cards/:cardId -> eliminar una tarjeta propia
router.delete('/:cardId', validateCardId, deleteCard);

// PUT /cards/:cardId/likes -> dar like
router.put('/:cardId/likes', validateCardId, likeCard);

// DELETE /cards/:cardId/likes -> quitar el like
router.delete('/:cardId/likes', validateCardId, dislikeCard);

module.exports = router;
