// ============================================================
// Popup.jsx — COMPONENTE REUTILIZABLE DE VENTANA EMERGENTE
// ============================================================
// Este es uno de los componentes MÁS IMPORTANTES del proyecto.
// Es REUTILIZABLE: lo usamos para TODOS los popups (editar perfil,
// nueva tarjeta, confirmar eliminación, editar avatar, e imagen).
//
// CONCEPTOS CLAVE:
//
// 1. PROPS (propiedades):
//    - onClose: función que se ejecuta al hacer clic en la X
//    - title: el título del popup (ej: "Editar perfil", "Nuevo lugar")
//    - children: el contenido INTERNO del popup (formularios, imágenes, etc.)
//
// 2. CHILDREN (hijos):
//    En React, todo lo que pones ENTRE las etiquetas de un componente
//    se pasa automáticamente como props.children. Ejemplo:
//
//    <Popup title="Hola">
//      <p>Este párrafo es props.children</p>
//    </Popup>
//
//    Esto nos permite meter CUALQUIER contenido dentro del Popup
//    sin tener que modificar el componente Popup en sí.
//
// 3. RENDERIZADO CONDICIONAL con operador ternario:
//    {title ? <h3>...</h3> : null}
//    Si title existe, muestra el h3. Si no (como en ImagePopup), no.
//
// 4. TEMPLATE LITERAL en className:
//    `popup__content ${!title ? "popup__content_content_image" : ""}`
//    Si NO hay título, agrega la clase especial para el popup de imagen.
// ============================================================

function Popup(props) {
  // Desestructuramos las props para no escribir props.title, props.onClose, etc.
  const { onClose, title, children } = props;

  return (
    // El div externo es el overlay oscuro que cubre toda la pantalla
    <div className="popup">
      {/* 
        El div interno es la "cajita" blanca del popup.
        Si NO hay título (popup de imagen), le agrega una clase extra
        para que el CSS lo estilice diferente.
      */}
      <div
        className={`popup__content ${
          !title ? "popup__content_content_image" : ""
        }`}
      >
        {/* Botón de cerrar (la X) — ejecuta la función onClose que viene de Main */}
        <button
          aria-label="Cerrar ventana emergente"
          className="popup__close"
          type="button"
          onClick={onClose}
        />

        {/* Solo muestra el título si existe (el popup de imagen no tiene) */}
        {title && <h3 className="popup__title">{title}</h3>}

        {/* Aquí se renderiza lo que sea que hayas puesto DENTRO del <Popup>...</Popup> */}
        {children}
      </div>
    </div>
  );
}

export default Popup;
