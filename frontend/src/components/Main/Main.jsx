import { useContext } from "react";
import Card from "./components/Card/Card";
import Popup from "./components/Popup/Popup";
import EditProfile from "./components/EditProfile/EditProfile";
import NewCard from "./components/NewCard/NewCard";
import EditAvatar from "./components/Avatar/EditAvatar";
import RemoveCard from "./components/RemoveCard/RemoveCard";
import CurrentUserContext from "../../contexts/CurrentUserContext";

export default function Main({
  cards,
  onCardLike,
  onCardDelete,
  onOpenPopup,
  onClosePopup,
  popup,
}) {
  // Obtenemos los datos del usuario desde el contexto
  // Antes estaban hardcodeados ("Jacques Cousteau", "Explorador")
  // Ahora vienen del servidor a traves del Provider en App.jsx
  const { currentUser } = useContext(CurrentUserContext);

  // Objetos que definen el contenido de cada popup
  const editProfilePopup = {
    title: "Editar perfil",
    children: <EditProfile />,
  };

  const newCardPopup = {
    title: "Nuevo lugar",
    children: <NewCard />,
  };

  const editAvatarPopup = {
    title: "Cambiar foto de perfil",
    children: <EditAvatar />,
  };

  // El botón de la papelera no borra directamente: abre la ventana de
  // confirmación. Solo al confirmar se llama a onCardDelete, que es
  // donde App.jsx lanza la solicitud DELETE a la API.
  function handleCardDeleteRequest(card) {
    onOpenPopup({
      title: "¿Estás seguro/a?",
      children: <RemoveCard onConfirm={() => onCardDelete(card)} />,
    });
  }

  return (
    <main className="content">
      {/* SECCION PERFIL - ahora usa datos del contexto */}
      <section className="profile page__section">
        <div className="profile__avatar">
          <img
            className="profile__image"
            src={currentUser.avatar}
            alt="Avatar"
          />
          <button
            className="profile__avatar-edit"
            type="button"
            aria-label="Cambiar foto de perfil"
            onClick={() => onOpenPopup(editAvatarPopup)}
          />
        </div>

        <div className="profile__info">
          {/* Antes: "Jacques Cousteau" hardcodeado */}
          {/* Ahora: currentUser.name del servidor */}
          <h1 className="profile__title">{currentUser.name}</h1>
          <button
            aria-label="Editar perfil"
            className="profile__edit-button"
            type="button"
            onClick={() => onOpenPopup(editProfilePopup)}
          />
          {/* Antes: "Explorador" hardcodeado */}
          {/* Ahora: currentUser.about del servidor */}
          <p className="profile__description">{currentUser.about}</p>
        </div>

        <button
          aria-label="Agregar tarjeta"
          className="profile__add-button"
          type="button"
          onClick={() => onOpenPopup(newCardPopup)}
        />
      </section>

      {/* SECCION TARJETAS - ahora usa cards del servidor (prop desde App) */}
      <section className="cards page__section">
        <ul className="cards__list">
          {cards.map((card) => (
            <Card
              key={card._id}
              card={card}
              onCardLike={onCardLike}
              onCardDelete={handleCardDeleteRequest}
              handleOpenPopup={onOpenPopup}
            />
          ))}
        </ul>
      </section>

      {/* POPUP CONDICIONAL */}
      {popup && (
        <Popup onClose={onClosePopup} title={popup.title}>
          {popup.children}
        </Popup>
      )}
    </main>
  );
}
