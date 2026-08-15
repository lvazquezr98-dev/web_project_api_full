import { Navigate, useLocation } from "react-router-dom";

// ============================================================
// ProtectedRoute.jsx — COMPONENTE DE ORDEN SUPERIOR (HOC)
// ============================================================
// Envuelve la ruta raíz "/" para que solo los usuarios autorizados
// puedan verla. Si isLoggedIn es false, redirige a /signin.
//
// Al redirigir guardamos la ubicación actual en location.state.from.
// Así, cuando el usuario inicie sesión, App.jsx puede devolverlo a
// la página que intentaba visitar en lugar de mandarlo siempre a "/".
// ============================================================

export default function ProtectedRoute({ isLoggedIn, children }) {
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return children;
}
