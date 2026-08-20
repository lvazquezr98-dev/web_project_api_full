# Alrededor de los EE. UU. — Proyecto full stack (Sprint 19)

Aplicación web completa donde una persona se registra, inicia sesión y comparte
fotografías de lugares: puede editar su perfil y su foto, agregar y eliminar sus
propias tarjetas, y dar o quitar "me gusta". El front-end en React y la API en
Node.js viven en este mismo repositorio y hablan entre ellos mediante JSON Web
Tokens.

## URL de la aplicación

- **Front-end:** https://around-luis.mooo.com
- **API (back-end):** https://api-around-luis.chickenkiller.com


## Funcionalidad

**Autenticación y autorización**

- Registro con correo electrónico y contraseña (`POST /signup`). La contraseña
  nunca se guarda en claro: se guarda su hash calculado con `bcryptjs`.
- Inicio de sesión (`POST /signin`). Si las credenciales son correctas, la API
  devuelve un JWT que caduca a los 7 días y cuyo payload contiene únicamente el
  `_id` del usuario.
- El cliente guarda ese token en el almacenamiento local y lo manda en el
  encabezado `Authorization: Bearer <token>` en todas las demás peticiones.
- Todas las rutas están protegidas menos `/signin` y `/signup`.
- La API nunca devuelve el hash de la contraseña (`select: false` en el esquema).

**Perfil y tarjetas**

- Ver y editar el perfil (nombre, descripción) y la foto de perfil.
- Ver todas las tarjetas, agregar tarjetas nuevas y eliminar **solo las propias**.
- Dar y quitar "me gusta".

## Tecnologías y técnicas

**Back-end (`backend/`)**

| Herramienta | Para qué se usa |
| --- | --- |
| Node.js + Express | Servidor y enrutamiento |
| MongoDB + Mongoose | Base de datos y modelado de los esquemas |
| bcryptjs | Hash de las contraseñas |
| jsonwebtoken | Creación y verificación de los JWT |
| validator | Validación de correos electrónicos y enlaces |
| celebrate (Joi) | Validación de los cuerpos y parámetros de las peticiones |
| winston + express-winston | Registro de solicitudes y errores en JSON |
| cors | Permitir las peticiones del front-end desde otro dominio |
| dotenv | Variables de entorno en el servidor |
| ESLint (airbnb-base) | Estilo de código |

Técnicas aplicadas: manejo **centralizado** de errores en un único middleware,
clases de error propias con su código de estado, validación de la entrada antes
de llegar a los controladores, y comprobación de permisos (nadie puede borrar
tarjetas ajenas ni editar el perfil de otra persona).

**Front-end (`frontend/`)**

React 19 con Vite y React Router. El estado del usuario se comparte con
`CurrentUserContext`, las rutas privadas se protegen con el componente de orden
superior `ProtectedRoute`, y los formularios usan el hook propio
`useFormAndValidation`.

## Estructura del proyecto

```
.
├── backend/
│   ├── app.js                 punto de entrada
│   ├── controllers/           lógica de usuarios y tarjetas
│   ├── errors/                clases de error con su código de estado
│   ├── middlewares/           auth, validadores, registros y manejo de errores
│   ├── models/                esquemas de Mongoose
│   ├── routes/                enrutadores de /users y /cards
│   └── utils/config.js        configuración por entorno
└── frontend/
    ├── src/components/        componentes de React
    ├── src/contexts/          CurrentUserContext
    ├── src/hooks/             useFormAndValidation
    └── src/utils/             api, auth, token y configuración
```

## Rutas de la API

| Método | Ruta | Protegida | Descripción |
| --- | --- | --- | --- |
| POST | `/signup` | No | Registrar un usuario |
| POST | `/signin` | No | Iniciar sesión y recibir el JWT |
| GET | `/users/me` | Sí | Datos del usuario autenticado |
| GET | `/users` | Sí | Todos los usuarios |
| GET | `/users/:userId` | Sí | Un usuario por su id |
| PATCH | `/users/me` | Sí | Actualizar nombre y descripción |
| PATCH | `/users/me/avatar` | Sí | Actualizar la foto de perfil |
| GET | `/cards` | Sí | Todas las tarjetas |
| POST | `/cards` | Sí | Crear una tarjeta |
| DELETE | `/cards/:cardId` | Sí | Eliminar una tarjeta propia |
| PUT | `/cards/:cardId/likes` | Sí | Dar "me gusta" |
| DELETE | `/cards/:cardId/likes` | Sí | Quitar el "me gusta" |

Códigos de error: `400` datos inválidos · `401` credenciales o token incorrectos
· `403` intento de borrar una tarjeta ajena · `404` recurso inexistente · `409`
correo ya registrado · `500` error inesperado. Toda respuesta de error contiene
un único campo `message`.

## Ejecutar el proyecto en local

Hace falta tener MongoDB corriendo en `mongodb://127.0.0.1:27017`.

```bash
# Back-end (http://localhost:3000)
cd backend
npm install
npm run dev

# Front-end (http://localhost:5173), en otra terminal
cd frontend
npm install
npm run dev
```

En desarrollo **no hace falta ningún archivo `.env`**: `backend/utils/config.js`
usa una clave secreta de desarrollo y la base de datos local.

Comprobación rápida de la API con la terminal:

```bash
curl -X POST http://localhost:3000/signup -H 'Content-Type: application/json' \
  -d '{"email":"tu@correo.com","password":"contrasena123"}'

TOKEN=$(curl -s -X POST http://localhost:3000/signin -H 'Content-Type: application/json' \
  -d '{"email":"tu@correo.com","password":"contrasena123"}' | sed 's/.*"token":"\([^"]*\)".*/\1/')

curl http://localhost:3000/users/me -H "Authorization: Bearer $TOKEN"
```

## Despliegue

### 1. Servidor

Crear una máquina virtual (por ejemplo en Google Cloud), instalar Node.js,
MongoDB, nginx y PM2, y clonar este repositorio.

### 2. Archivo `.env` (solo en el servidor)

```bash
cd backend
cp .env.example .env
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"  # clave para JWT_SECRET
```

El archivo `.env` está en `.gitignore` y no se sube nunca al repositorio.

### 3. Front-end

```bash
cd frontend
cp .env.example .env.production   # y poner ahí VITE_API_URL con el subdominio de la API
npm run build                     # genera frontend/dist
```

Copiar el contenido de `dist/` al servidor (por ejemplo con `scp`) y servirlo
con nginx. La API se publica en un subdominio (`api.tu-dominio.com`) con su
propio bloque de nginx que hace de proxy hacia `http://localhost:3000`.

### 4. Despliegue en el servidor

```bash
cd backend
npm install --omit=dev
pm2 start app.js --name around-api
pm2 save
pm2 startup      # para que sobreviva a un reinicio de la máquina
```

PM2 reinicia el proceso automáticamente si el servidor se cae, y `pm2 startup`
hace que la API vuelva a levantarse incluso después de reiniciar la máquina.

### 5. Certificados

Emitir el certificado con Certbot (Let's Encrypt) para el dominio y el
subdominio, de modo que el cliente hable con el servidor por HTTPS.

## Registros

El servidor guarda cada solicitud en `backend/request.log` y cada error en
`backend/error.log`, ambos en formato JSON. Los dos archivos están en
`.gitignore` y se quedan únicamente en el servidor.
