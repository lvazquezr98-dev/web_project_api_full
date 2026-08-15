// ============================================================
// Footer.jsx — COMPONENTE DEL PIE DE PÁGINA
// ============================================================
// El componente más simple del proyecto.
// Solo renderiza el texto de copyright.
//
// CONCEPTO CLAVE: Componente "presentacional"
// Este componente NO tiene estado (useState), NO tiene lógica,
// NO recibe props. Solo muestra contenido estático.
// En el mundo React, esto se llama "componente presentacional"
// o "componente tonto" (dumb component).
//
// ¿Por qué separarlo en su propio archivo?
// Porque la regla de React es: 1 componente = 1 archivo.
// Aunque sea pequeño, mantenerlo separado hace que tu código
// sea más organizado y fácil de mantener.
// ============================================================

function Footer() {
  return (
    <footer className="footer page__section">
      <p className="footer__copyright">&copy; 2025 Around The U.S.</p>
    </footer>
  );
}

export default Footer;
