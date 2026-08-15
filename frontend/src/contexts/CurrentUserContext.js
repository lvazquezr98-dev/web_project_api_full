import { createContext } from "react";

// createContext() crea un "canal" para compartir datos entre componentes
// sin tener que pasar props manualmente en cada nivel del arbol.
//
// Piensa en esto como una radio FM:
// - El Provider (en App.jsx) es la estacion que TRANSMITE los datos
// - Los componentes que usan useContext() son los radios que RECIBEN
//
// El valor por defecto ({}) se usa solo si un componente intenta
// leer el contexto SIN estar dentro de un Provider (caso raro).
const CurrentUserContext = createContext({});

export default CurrentUserContext;
