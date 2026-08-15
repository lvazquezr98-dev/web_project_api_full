import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Header from "./Header/Header";
import Main from "./Main/Main";
import Footer from "./Footer/Footer";
import Login from "./Login/Login";
import Register from "./Register/Register";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
import InfoTooltip from "./InfoTooltip/InfoTooltip";
import api from "../utils/api";
import * as auth from "../utils/auth";
import { setToken, getToken, removeToken } from "../utils/token";
import isCardLikedBy from "../utils/likes";
import CurrentUserContext from "../contexts/CurrentUserContext";

function App() {
  // ---------- Estado de la funcionalidad principal ----------
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [popup, setPopup] = useState(null);

  // ---------- Estado de la autenticación ----------
  // isLoggedIn: si el usuario está autorizado.
  // email: el correo del usuario autorizado, se muestra en el Header.
  // isAuthChecked: evita que ProtectedRoute redirija a /signin mientras
  // todavía se comprueba el token guardado en el almacenamiento local.
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  // El JWT también vive en el estado, además de en el almacenamiento local:
  // el almacenamiento lo conserva entre visitas y el estado hace que React
  // vuelva a renderizar en cuanto la sesión cambia. La inicialización
  // perezosa lo recupera de localStorage al montar la aplicación.
  const [token, setTokenState] = useState(() => getToken());
  // Si no hay ningún JWT guardado no hay nada que comprobar: la
  // inicialización perezosa deja isAuthChecked en true desde el principio.
  const [isAuthChecked, setIsAuthChecked] = useState(() => !getToken());

  // ---------- Estado de la ventana informativa ----------
  const [tooltip, setTooltip] = useState({
    isOpen: false,
    isSuccess: false,
    message: "",
  });

  // Atajo para avisar al usuario de que una operación falló. Sin esto,
  // un error de la API solo quedaría registrado en la consola y el
  // usuario no sabría por qué no pasó nada.
  function showError(message) {
    setTooltip({ isOpen: true, isSuccess: false, message });
  }

  const navigate = useNavigate();
  const location = useLocation();

  // Al montar App comprobamos si existe un JWT en el almacenamiento local.
  // Si lo hay, preguntamos a la API si sigue siendo válido: así el usuario
  // no necesita volver a iniciar sesión en visitas posteriores.
  useEffect(() => {
    if (!token) {
      return;
    }

    auth
      .checkToken(token)
      .then((user) => {
        // Nuestro back-end devuelve el usuario directamente (no { data: {...} }),
        // así que ya podemos rellenar el perfil con esta misma respuesta.
        setIsLoggedIn(true);
        setEmail(user.email);
        setCurrentUser(user);
      })
      .catch((err) => {
        // Un token caducado o inválido se descarta.
        console.error("Token inválido:", err);
        removeToken();
        setTokenState(null);
      })
      .finally(() => setIsAuthChecked(true));
  }, [token]);

  // Los datos del usuario y las tarjetas solo se piden cuando el usuario
  // ya está autorizado, y una sola vez por sesión.
  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    api
      .getUserInfo()
      .then((userData) => setCurrentUser(userData))
      .catch((err) => {
        console.error("Error cargando usuario:", err);
        showError(
          "No pudimos cargar tu perfil. Vuelve a intentarlo más tarde.",
        );
      });

    api
      .getInitialCards()
      .then((cardsData) => setCards(cardsData))
      .catch((err) => {
        console.error("Error cargando tarjetas:", err);
        showError(
          "No pudimos cargar las tarjetas. Vuelve a intentarlo más tarde.",
        );
      });
  }, [isLoggedIn]);

  // ---------- Controladores de autenticación ----------

  // Registro: POST /signup. Se muestra el InfoTooltip con el resultado y,
  // si todo salió bien, se lleva al usuario a la página de inicio de sesión.
  function handleRegister({ email: userEmail, password }) {
    if (!userEmail || !password) {
      return;
    }

    auth
      .register(userEmail, password)
      .then(() => {
        setTooltip({ isOpen: true, isSuccess: true, message: "" });
        navigate("/signin");
      })
      .catch((err) => {
        console.error("Error en el registro:", err);
        // Sin mensaje propio: se usa el texto por defecto del InfoTooltip,
        // que es el que fija el marco FAIL del diseño de Figma.
        setTooltip({ isOpen: true, isSuccess: false, message: "" });
      });
  }

  // Autorización: POST /signin. Se guarda el JWT en el almacenamiento local
  // y se redirige al usuario a la ruta que intentaba visitar (o a "/").
  function handleLogin({ email: userEmail, password }) {
    if (!userEmail || !password) {
      return;
    }

    auth
      .authorize(userEmail, password)
      .then((data) => {
        if (data.token) {
          // El token se guarda en el almacenamiento local (para las próximas
          // visitas) y en el estado (para que api.js lo use de inmediato).
          setToken(data.token);
          setTokenState(data.token);
          setIsLoggedIn(true);
          setEmail(userEmail);

          const redirectPath = location.state?.from?.pathname || "/";
          navigate(redirectPath, { replace: true });
        }
      })
      .catch((err) => {
        console.error("Error al iniciar sesión:", err);
        showError(
          "No pudimos iniciar tu sesión. Revisa tu correo y tu contraseña.",
        );
      });
  }

  // Cierre de sesión: se elimina el JWT y se devuelve al usuario a /signin.
  function handleSignOut() {
    removeToken();
    setTokenState(null);
    setIsLoggedIn(false);
    setEmail("");
    setCurrentUser({});
    setCards([]);
    navigate("/signin");
  }

  function handleCloseTooltip() {
    setTooltip({ isOpen: false, isSuccess: false, message: "" });
  }

  // ---------- Controladores de la funcionalidad principal ----------

  function handleOpenPopup(popupData) {
    setPopup(popupData);
  }

  function handleClosePopup() {
    setPopup(null);
  }

  async function handleCardLike(card) {
    // El servidor no manda un booleano: hay que mirar si nuestro _id está
    // dentro del array likes de la tarjeta.
    const isLiked = isCardLikedBy(card, currentUser._id);

    await api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((currentCard) =>
            currentCard._id === card._id ? newCard : currentCard,
          ),
        );
      })
      .catch((err) => {
        console.error("Error en like:", err);
        showError(
          "No pudimos registrar tu \u00abme gusta\u00bb. Inténtalo de nuevo.",
        );
      });
  }

  async function handleCardDelete(card) {
    await api
      .deleteCard(card._id)
      .then(() => {
        setCards((state) =>
          state.filter((currentCard) => currentCard._id !== card._id),
        );
        handleClosePopup();
      })
      .catch((err) => {
        console.error("Error eliminando tarjeta:", err);
        handleClosePopup();
        showError("No pudimos eliminar la tarjeta. Inténtalo de nuevo.");
      });
  }

  function handleUpdateUser(data) {
    api
      .updateUserInfo(data)
      .then((newData) => {
        setCurrentUser(newData);
        handleClosePopup();
      })
      .catch((err) => {
        console.error("Error actualizando perfil:", err);
        handleClosePopup();
        showError("No pudimos guardar tu perfil. Inténtalo de nuevo.");
      });
  }

  function handleUpdateAvatar(data) {
    api
      .updateAvatar(data.avatar)
      .then((newData) => {
        setCurrentUser(newData);
        handleClosePopup();
      })
      .catch((err) => {
        console.error("Error actualizando avatar:", err);
        handleClosePopup();
        showError("No pudimos cambiar tu foto de perfil. Inténtalo de nuevo.");
      });
  }

  function handleAddPlaceSubmit(data) {
    api
      .addCard(data)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        handleClosePopup();
      })
      .catch((err) => {
        console.error("Error agregando tarjeta:", err);
        handleClosePopup();
        showError("No pudimos agregar la tarjeta. Inténtalo de nuevo.");
      });
  }

  // Mientras se comprueba el token no renderizamos las rutas: si lo
  // hiciéramos, ProtectedRoute mandaría a /signin a un usuario que sí
  // tiene una sesión válida guardada.
  if (!isAuthChecked) {
    return <div className="page__content" />;
  }

  return (
    // El Provider envuelve toda la app y comparte currentUser + handlers
    <CurrentUserContext.Provider
      value={{
        currentUser,
        handleUpdateUser,
        handleUpdateAvatar,
        handleAddPlaceSubmit,
      }}
    >
      <div className="page__content">
        <Header
          isLoggedIn={isLoggedIn}
          email={email}
          onSignOut={handleSignOut}
        />

        <Routes>
          {/* La ruta raíz es la única protegida por el HOC ProtectedRoute. */}
          <Route
            path="/"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <>
                  <Main
                    cards={cards}
                    onCardLike={handleCardLike}
                    onCardDelete={handleCardDelete}
                    onOpenPopup={handleOpenPopup}
                    onClosePopup={handleClosePopup}
                    popup={popup}
                  />
                  <Footer />
                </>
              </ProtectedRoute>
            }
          />

          {/* /signin y /signup son públicas: no van envueltas en
              ProtectedRoute. Si el usuario ya inició sesión no tiene
              sentido mostrárselas, así que lo devolvemos a la raíz. */}
          <Route
            path="/signin"
            element={
              isLoggedIn ? (
                <Navigate to="/" replace />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/signup"
            element={
              isLoggedIn ? (
                <Navigate to="/" replace />
              ) : (
                <Register onRegister={handleRegister} />
              )
            }
          />

          {/* Cualquier otra ruta redirige según el estado de la sesión. */}
          <Route
            path="*"
            element={<Navigate to={isLoggedIn ? "/" : "/signin"} replace />}
          />
        </Routes>

        <InfoTooltip
          isOpen={tooltip.isOpen}
          isSuccess={tooltip.isSuccess}
          message={tooltip.message}
          onClose={handleCloseTooltip}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
