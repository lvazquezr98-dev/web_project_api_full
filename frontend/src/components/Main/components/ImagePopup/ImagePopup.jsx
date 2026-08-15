// ============================================================
// ImagePopup.jsx — COMPONENTE DE IMAGEN EN GRANDE
// ============================================================
// Este componente recibe los datos de una tarjeta (card) y
// renderiza la imagen grande con su caption (título).
//
// Se usa como children del Popup, pero a diferencia de los
// formularios, este popup NO tiene título (title="").
//
// CONCEPTO CLAVE:
// Este componente recibe props.card con { name, link }.
// Si no hay card (es null), no renderiza nada.
// ============================================================

function ImagePopup(props) {
  const { card } = props;

  return (
    <>
      {/* Imagen grande del lugar */}
      <img className="popup__image" src={card.link} alt={card.name} />
      {/* Pie de imagen con el nombre del lugar */}
      <p className="popup__caption">{card.name}</p>
    </>
  );
}

export default ImagePopup;
