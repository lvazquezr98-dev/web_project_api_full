import { useContext, useEffect } from "react";
import CurrentUserContext from "../../../../contexts/CurrentUserContext";
import useFormAndValidation from "../../../../hooks/useFormAndValidation";

export default function EditProfile() {
  // Obtenemos el usuario actual y la funcion para actualizar desde el contexto
  const { currentUser, handleUpdateUser } = useContext(CurrentUserContext);

  // El hook gestiona valores, errores y validez del formulario
  const { values, errors, isValid, handleChange, resetForm } =
    useFormAndValidation({ name: "", description: "" });

  // Este formulario arranca relleno con los datos actuales del usuario,
  // asi que se considera valido desde el principio: por eso resetForm
  // recibe true como tercer argumento.
  useEffect(() => {
    resetForm(
      {
        name: currentUser.name || "",
        description: currentUser.about || "",
      },
      {},
      true,
    );
  }, [currentUser, resetForm]);

  // Al enviar el formulario llamamos a handleUpdateUser del contexto,
  // que esta definida en App.jsx y hace la peticion PATCH a la API
  function handleSubmit(e) {
    e.preventDefault();

    if (!isValid) {
      return;
    }

    handleUpdateUser({ name: values.name, about: values.description });
  }

  return (
    <form
      className="popup__form"
      name="edit-profile-form"
      noValidate
      onSubmit={handleSubmit}
    >
      <label className="popup__field">
        <input
          className={`popup__input popup__input_type_name ${
            errors.name ? "popup__input_type_error" : ""
          }`}
          id="profile-name-input"
          maxLength="40"
          minLength="2"
          name="name"
          placeholder="Nombre"
          required
          type="text"
          value={values.name}
          onChange={handleChange}
        />
        <span
          className={`popup__error ${
            errors.name ? "popup__error_visible" : ""
          }`}
          id="profile-name-input-error"
        >
          {errors.name}
        </span>
      </label>
      <label className="popup__field">
        <input
          className={`popup__input popup__input_type_description ${
            errors.description ? "popup__input_type_error" : ""
          }`}
          id="profile-description-input"
          maxLength="200"
          minLength="2"
          name="description"
          placeholder="Acerca de mi"
          required
          type="text"
          value={values.description}
          onChange={handleChange}
        />
        <span
          className={`popup__error ${
            errors.description ? "popup__error_visible" : ""
          }`}
          id="profile-description-input-error"
        >
          {errors.description}
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
