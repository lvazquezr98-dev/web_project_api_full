import { useContext } from "react";
import CurrentUserContext from "../../../../contexts/CurrentUserContext";
import useFormAndValidation from "../../../../hooks/useFormAndValidation";

export default function NewCard() {
  const { handleAddPlaceSubmit } = useContext(CurrentUserContext);

  const { values, errors, isValid, handleChange } = useFormAndValidation({
    name: "",
    link: "",
  });

  function handleSubmit(e) {
    e.preventDefault();

    if (!isValid) {
      return;
    }

    handleAddPlaceSubmit({ name: values.name, link: values.link });
  }

  return (
    <form
      className="popup__form"
      name="new-card-form"
      noValidate
      onSubmit={handleSubmit}
    >
      <label className="popup__field">
        <input
          className={`popup__input popup__input_type_name ${
            errors.name ? "popup__input_type_error" : ""
          }`}
          id="place-name-input"
          maxLength="30"
          minLength="2"
          name="name"
          placeholder="Titulo"
          required
          type="text"
          value={values.name}
          onChange={handleChange}
        />
        <span
          className={`popup__error ${
            errors.name ? "popup__error_visible" : ""
          }`}
          id="place-name-input-error"
        >
          {errors.name}
        </span>
      </label>
      <label className="popup__field">
        <input
          className={`popup__input popup__input_type_url ${
            errors.link ? "popup__input_type_error" : ""
          }`}
          id="place-url-input"
          name="link"
          placeholder="URL de la imagen"
          required
          type="url"
          value={values.link}
          onChange={handleChange}
        />
        <span
          className={`popup__error ${
            errors.link ? "popup__error_visible" : ""
          }`}
          id="place-url-input-error"
        >
          {errors.link}
        </span>
      </label>
      <button
        className={`button popup__button ${
          !isValid ? "popup__button_disabled" : ""
        }`}
        type="submit"
        disabled={!isValid}
      >
        Crear
      </button>
    </form>
  );
}
