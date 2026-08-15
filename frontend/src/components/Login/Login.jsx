import { Link } from "react-router-dom";
import useFormAndValidation from "../../hooks/useFormAndValidation";

// ============================================================
// Login.jsx — AUTORIZACIÓN DEL USUARIO
// ============================================================
// Componente controlado. Los valores, los errores y la validez del
// formulario los gestiona el hook useFormAndValidation, que se apoya
// en la validación nativa del navegador.
//
// El componente NO habla con la API: solo recoge datos válidos y
// llama a onLogin, que está definido en App.jsx.
//
// El botón de envío permanece deshabilitado mientras algún campo sea
// inválido, de modo que nunca se envían datos nulos o incorrectos.
// ============================================================

export default function Login({ onLogin }) {
  const { values, errors, isValid, handleChange } = useFormAndValidation({
    email: "",
    password: "",
  });

  function handleSubmit(e) {
    e.preventDefault();

    // Doble seguro: aunque el botón esté deshabilitado, el formulario
    // podría enviarse con la tecla Enter.
    if (!isValid) {
      return;
    }

    onLogin({ email: values.email, password: values.password });
  }

  return (
    <main className="auth page__section">
      <h2 className="auth__title">Inicia sesión</h2>

      <form
        className="auth__form"
        name="login-form"
        noValidate
        onSubmit={handleSubmit}
      >
        <label className="auth__field">
          <span className="auth__label">Correo electrónico</span>
          <input
            className={`auth__input ${
              errors.email ? "auth__input_type_error" : ""
            }`}
            id="login-email-input"
            name="email"
            type="email"
            placeholder="Correo electrónico"
            autoComplete="email"
            required
            value={values.email}
            onChange={handleChange}
          />
          <span
            className={`auth__error ${
              errors.email ? "auth__error_visible" : ""
            }`}
            id="login-email-input-error"
          >
            {errors.email}
          </span>
        </label>

        <label className="auth__field">
          <span className="auth__label">Contraseña</span>
          <input
            className={`auth__input ${
              errors.password ? "auth__input_type_error" : ""
            }`}
            id="login-password-input"
            name="password"
            type="password"
            placeholder="Contraseña"
            autoComplete="current-password"
            minLength="4"
            required
            value={values.password}
            onChange={handleChange}
          />
          <span
            className={`auth__error ${
              errors.password ? "auth__error_visible" : ""
            }`}
            id="login-password-input-error"
          >
            {errors.password}
          </span>
        </label>

        <button
          className={`auth__button ${!isValid ? "auth__button_disabled" : ""}`}
          type="submit"
          disabled={!isValid}
        >
          Inicia sesión
        </button>
      </form>

      <p className="auth__signup">
        <Link to="/signup" className="auth__link">
          ¿Aún no eres miembro? Regístrate aquí
        </Link>
      </p>
    </main>
  );
}
