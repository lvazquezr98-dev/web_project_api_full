import { Link, useLocation } from "react-router-dom";
import logo from "../../images/logo.svg";

// ============================================================
// Header.jsx — COMPONENTE DEL ENCABEZADO
// ============================================================
// El encabezado cambia según el estado de la sesión, tal y como
// pide el diseño de Figma:
//
//   • Usuario autorizado  → correo electrónico + "Cerrar sesión"
//   • Ruta /signup        → enlace "Iniciar sesión"
//   • Ruta /signin        → enlace "Regístrate"
//
// El controlador onSignOut se define en App.jsx y llega como prop.
//
// CONCEPTO CLAVE: Importación de imágenes en Vite
// Las imágenes se IMPORTAN como módulos para que Vite las procese
// y genere la ruta correcta en el build final.
// ============================================================

export default function Header({ isLoggedIn, email, onSignOut }) {
  const location = useLocation();
  const isRegisterPage = location.pathname === "/signup";

  return (
    <header className="header page__section">
      <Link to="/" className="header__logo-link">
        <img
          src={logo}
          alt="Logotipo Around The U.S."
          className="logo header__logo"
        />
      </Link>

      <nav className="header__nav">
        {isLoggedIn ? (
          <>
            <p className="header__email">{email}</p>
            <button
              className="header__link header__link_type_signout"
              type="button"
              onClick={onSignOut}
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <Link
            to={isRegisterPage ? "/signin" : "/signup"}
            className="header__link"
          >
            {isRegisterPage ? "Iniciar sesión" : "Regístrate"}
          </Link>
        )}
      </nav>
    </header>
  );
}
