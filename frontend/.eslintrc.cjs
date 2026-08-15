// ============================================================
// .eslintrc.cjs — CONFIGURACIÓN DE ESLINT
// ============================================================
// ESLint es una herramienta que revisa tu código y te avisa
// de errores o malas prácticas.
//
// La línea clave aquí es: "react/prop-types": "off"
// Esto desactiva la regla que te pide definir los tipos de props.
// Lo hacemos porque en este proyecto no usamos PropTypes
// (se usa más TypeScript en proyectos reales).
// ============================================================

module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  settings: { react: { version: "18.2" } },
  plugins: ["react-refresh"],
  rules: {
    "react/jsx-no-target-blank": "off",
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "react/prop-types": "off",
  },
};
