import successIcon from "../../images/success.svg";
import errorIcon from "../../images/error.svg";

// ============================================================
// InfoTooltip.jsx — VENTANA MODAL DE RESULTADO DEL REGISTRO
// ============================================================
// Reutiliza el marcado y los estilos del bloque "popup" que ya
// usan las demás ventanas emergentes del proyecto, con un
// modificador propio para el icono y el mensaje.
//
// Props:
//   isOpen    → si es false el componente no renderiza nada
//   isSuccess → decide el icono y el texto por defecto
//   message   → texto concreto, opcional. Permite reutilizar esta misma
//               ventana para avisar de cualquier error de la API, no solo
//               de los del registro.
//   onClose   → cierra la ventana (botón X u overlay)
// ============================================================

export default function InfoTooltip({ isOpen, isSuccess, message, onClose }) {
  if (!isOpen) {
    return null;
  }

  const text =
    message ||
    (isSuccess
      ? "¡Correcto! Ya estás registrado."
      : "Uy, algo salió mal. Por favor, inténtalo de nuevo.");

  // Un clic sobre el fondo oscuro (y no sobre la tarjeta) cierra la ventana.
  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  return (
    <div className="popup" onClick={handleOverlayClick}>
      <div className="popup__content popup__content_type_tooltip">
        <button
          aria-label="Cerrar ventana emergente"
          className="popup__close"
          type="button"
          onClick={onClose}
        />
        <img
          className="popup__tooltip-icon"
          src={isSuccess ? successIcon : errorIcon}
          alt={isSuccess ? "Registro exitoso" : "Error en el registro"}
        />
        <p className="popup__tooltip-text">{text}</p>
      </div>
    </div>
  );
}
