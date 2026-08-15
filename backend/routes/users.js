// routes/users.js
// Rutas que empiezan con /users. Todas están protegidas: el middleware de
// autorización se aplica al montar el enrutador en app.js.
//
// La ruta de creación de usuarios ya no vive aquí: ahora es POST /signup.

const express = require('express');

const {
  getUsers,
  getUserById,
  getCurrentUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

const {
  validateUserId,
  validateUpdateProfile,
  validateUpdateAvatar,
} = require('../middlewares/validators');

const router = express.Router();

// GET /users -> todos los usuarios
router.get('/', getUsers);

// GET /users/me -> los datos del usuario que hace la petición
router.get('/me', getCurrentUser);

// PATCH /users/me -> actualizar el perfil (name y about)
router.patch('/me', validateUpdateProfile, updateProfile);

// PATCH /users/me/avatar -> actualizar el avatar
router.patch('/me/avatar', validateUpdateAvatar, updateAvatar);

// GET /users/:userId -> un usuario por su _id.
// Va al final para que '/me' no se confunda con un :userId.
router.get('/:userId', validateUserId, getUserById);

module.exports = router;
