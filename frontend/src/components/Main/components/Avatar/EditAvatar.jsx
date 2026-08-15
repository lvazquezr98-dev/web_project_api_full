import { useContext } from "react";
import CurrentUserContext from "../../../../contexts/CurrentUserContext";
import useFormAndValidation from "../../../../hooks/useFormAndValidation";

// Antes este formulario leia el valor con useRef. Se cambio a componente
// controlado para poder validar el enlace mientras el usuario escribe y
// mostrarle el error, igual que en el resto de formularios del proyecto.

export default function EditAvatar() {
  const { handleUpdateAvatar } = useContext(CurrentUserContext);

  const { values, errors, isValid, handleChange } = useFormAndValidation({
    avatar: "",
  });

  function handleSubmit(e) {
    e.preventDefault();

    if (!isValid) {
      return;
    }

    handleUpdateAvatar({ avatar: values.avatar });
  }

  return (
    <form
      className="popup__form"
      name="avatar-form"
      noValidate
      onSubmit={handleSubmit}
    >
      <label className="popup__field">
        <input
          className={`popup__input popup__input_type_url ${
            errors.avatar ? "popup__input_type_error" : ""
          }`}
          id="avatar-url-input"
          name="avatar"
          placeholder="URL de la imagen"
          required
          type="url"
          value={values.avatar}
          onChange={handleChange}
        />
        <span
          className={`popup__error ${
            errors.avatar ? "popup__error_visible" : ""
          }`}
          id="avatar-url-input-error"
        >
          {errors.avatar}
        </span>
      </label>
      <button
        className={`button popup__button ${
          !isValid ? "popup__button_disabled" : ""
        }`}
        type="submit"
        disabled={!isValid}
      >
        Guardar
      </button>
    </form>
  );
}
