import { Link } from "react-router-dom";
import useFormAndValidation from "../../hooks/useFormAndValidation";

// ============================================================
// Register.jsx — REGISTRO DEL USUARIO
// ============================================================
// Mismo patrón que Login: componente controlado cuyos valores,
// errores y validez gestiona el hook useFormAndValidation.
//
// La solicitud POST /signup se hace en App.jsx a través del
// controlador onRegister que llega como prop, y solo se dispara si
// el formulario es válido.
// ============================================================

export default function Register({ onRegister }) {
  const { values, errors, isValid, handleChange } = useFormAndValidation({
    email: "",
    password: "",
  });

  function handleSubmit(e) {
    e.preventDefault();

    if (!isValid) {
      return;
    }

    onRegister({ email: values.email, password: values.password });
  }

  return (
    <main className="auth page__section">
      <h2 className="auth__title">Regístrate</h2>

      <form
        className="auth__form"
        name="register-form"
        noValidate
        onSubmit={handleSubmit}
      >
        <label className="auth__field">
          <span className="auth__label">Correo electrónico</span>
          <input
            className={`auth__input ${
              errors.email ? "auth__input_type_error" : ""
            }`}
            id="register-email-input"
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
            id="register-email-input-error"
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
            id="register-password-input"
            name="password"
            type="password"
            placeholder="Contraseña"
            autoComplete="new-password"
            minLength="4"
            required
            value={values.password}
            onChange={handleChange}
          />
          <span
            className={`auth__error ${
              errors.password ? "auth__error_visible" : ""
            }`}
            id="register-password-input-error"
          >
            {errors.password}
          </span>
        </label>

        <button
          className={`auth__button ${!isValid ? "auth__button_disabled" : ""}`}
          type="submit"
          disabled={!isValid}
        >
          Regístrate
        </button>
      </form>

      <p className="auth__signup">
        <Link to="/signin" className="auth__link">
          ¿Ya eres miembro? Inicia sesión aquí
        </Link>
      </p>
    </main>
  );
}
