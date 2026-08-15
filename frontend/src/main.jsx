// ============================================================
// main.jsx — PUNTO DE ENTRADA DE LA APLICACIÓN
// ============================================================
// Este archivo es lo PRIMERO que ejecuta React cuando abre tu app.
//
// ¿Qué hace?
// 1. Importa React y ReactDOM (las librerías base)
// 2. Importa tu hoja de estilos principal (index.css)
// 3. Importa el componente App (el componente raíz)
// 4. "Monta" App dentro del elemento con id="root" en index.html
//
// Piensa en esto como el "enchufe" que conecta React al HTML.
// El archivo index.html de Vite tiene un <div id="root"></div>,
// y aquí le decimos a React: "renderiza TODO dentro de ese div".
// ============================================================

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./components/App";
import "./index.css";

// BrowserRouter habilita el enrutado del lado del cliente. Debe envolver
// a App porque dentro de App se usan los hooks useNavigate y useLocation.
//
// createRoot() crea el punto de montaje de React
// .render() le dice QUÉ componente renderizar ahí
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
