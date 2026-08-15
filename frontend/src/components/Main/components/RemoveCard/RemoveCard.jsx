// ============================================================
// RemoveCard.jsx — CONFIRMACIÓN DE ELIMINAR TARJETA
// ============================================================
// Formulario simple con solo un botón "Sí" para confirmar
// la eliminación de una tarjeta. Sin campos de entrada.
// ============================================================

function RemoveCard({ onConfirm }) {
  // Al enviar el formulario se avisa a Main, que a su vez llama al
  // controlador handleCardDelete definido en App.jsx.
  function handleSubmit(e) {
    e.preventDefault();
    onConfirm();
  }

  return (
    <form
      className="popup__form"
      name="confirm-delete-form"
      id="confirm-delete-form"
      noValidate
      onSubmit={handleSubmit}
    >
      {/* Solo un botón de confirmación, sin campos de texto */}
      <button className="button popup__button" type="submit">
        Sí
      </button>
    </form>
  );
}

export default RemoveCard;
