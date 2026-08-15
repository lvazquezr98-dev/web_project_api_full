import { useContext } from "react";
import ImagePopup from "../ImagePopup/ImagePopup";
import CurrentUserContext from "../../../../contexts/CurrentUserContext";
import isCardLikedBy from "../../../../utils/likes";

function Card({ card, onCardLike, onCardDelete, handleOpenPopup }) {
  const { name, link } = card;
  const { currentUser } = useContext(CurrentUserContext);

  // Nuestra API devuelve el array likes con los _id de quienes dieron
  // "me gusta", así que el corazón se enciende si el nuestro está dentro.
  const isLiked = isCardLikedBy(card, currentUser._id);

  // Determina si la tarjeta es del usuario actual (para mostrar boton eliminar)
  const isOwn =
    card.owner === currentUser._id || card.owner?._id === currentUser._id;

  // Clase del boton like: activa si ya le diste like
  const cardLikeButtonClassName =
    "card__like-button " + (isLiked ? "card__like-button_is-active" : "");

  function handleLikeClick() {
    onCardLike(card);
  }

  function handleDeleteClick() {
    onCardDelete(card);
  }

  // El popup de imagen no lleva titulo: por eso se pasa una cadena vacia
  // y el contenido se delega en el componente ImagePopup.
  function handleImageClick() {
    handleOpenPopup({
      title: "",
      children: <ImagePopup card={card} />,
    });
  }

  return (
    <li className="card">
      <img
        className="card__image"
        src={link}
        alt={name}
        onClick={handleImageClick}
      />
      {/* Solo muestra el boton eliminar si la tarjeta es tuya */}
      {isOwn && (
        <button
          aria-label="Eliminar tarjeta"
          className="card__delete-button"
          type="button"
          onClick={handleDeleteClick}
        />
      )}
      <div className="card__description">
        <h2 className="card__title">{name}</h2>
        <button
          aria-label="Boton Me gusta"
          type="button"
          className={cardLikeButtonClassName}
          onClick={handleLikeClick}
        />
      </div>
    </li>
  );
}

export default Card;
