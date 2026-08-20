// app.js
// PUNTO DE ENTRADA del back-end: lo que se ejecuta con npm run start.

// dotenv carga las variables del archivo .env del servidor (NODE_ENV,
// JWT_SECRET...). En desarrollo no existe ese archivo y no pasa nada:
// utils/config.js tiene valores por defecto para ese caso.
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Controladores de registro e inicio de sesión: son las dos únicas rutas
// públicas, por eso viven en app.js y no en un enrutador protegido.
const { createUser, login } = require('./controllers/users');

// Enrutadores modulares (carpeta routes/).
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/error-handler');
const { validateCreateUser, validateLogin } = require('./middlewares/validators');
const NotFoundError = require('./errors/NotFoundError');
const { PORT, MONGO_URL } = require('./utils/config');

const app = express();

// Conexión a MongoDB. Si falla, mostramos un mensaje claro en vez de dejar
// que Node tumbe el proceso con un stack trace enorme.
mongoose
  .connect(MONGO_URL)
  .then(() => console.log('Conectado a la base de datos aroundb'))
  .catch((err) => console.error('No se pudo conectar a MongoDB:', err.message));

// CORS: el front-end vive en otro dominio (o en otro puerto durante el
// desarrollo), así que el navegador necesita este permiso para llamar a la API.
app.use(cors());
app.options('*', cors());

// Analiza el cuerpo de las peticiones en formato JSON y lo deja en req.body.
app.use(express.json());

// Registro de solicitudes: va antes de las rutas para que quede constancia
// de TODAS las peticiones que llegan (request.log).
app.use(requestLogger);

// ---------- Rutas públicas ----------
app.post('/signin', validateLogin, login);
app.post('/signup', validateCreateUser, createUser);

// ---------- Rutas protegidas ----------
// Todo lo que va después del middleware auth exige un JWT válido.
app.use('/users', auth, usersRouter);
app.use('/cards', auth, cardsRouter);

// Middleware "atrapa todo": si ninguna ruta anterior respondió, el recurso
// no existe. El error se pasa al manejador centralizado, no se responde aquí.
app.use((req, res, next) => {
  next(new NotFoundError('Recurso solicitado no encontrado'));
});

// Registro de errores (error.log): va después de las rutas y antes de los
// manejadores de errores.
app.use(errorLogger);

// Manejador centralizado de errores: siempre el último. También traduce los
// errores de validación de celebrate, para que TODAS las respuestas de error
// de la API tengan la misma forma: { message: "..." }.
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`El servidor está escuchando en el puerto ${PORT}`);
});
