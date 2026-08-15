import { useCallback, useState } from "react";

// ============================================================
// useFormAndValidation.js — HOOK DE FORMULARIOS CON VALIDACIÓN
// ============================================================
// Hook personalizado que centraliza en un solo sitio lo que antes
// repetía cada formulario: los valores de los campos, sus errores y
// si el formulario completo es válido.
//
// Se apoya en la API de validación nativa del navegador
// (el objeto ValidityState de cada input y form.checkValidity()),
// pero traduce los mensajes al español para que el usuario lea algo
// claro en lugar del texto por defecto del navegador.
//
// Devuelve:
//   values      → { nombreDelCampo: valor }
//   errors      → { nombreDelCampo: "mensaje de error" }
//   isValid     → true solo si TODOS los campos son válidos
//   handleChange→ controlador único para el onChange de cada input
//   resetForm   → reinicia valores, errores y validez
// ============================================================

// Traduce el estado de validación de un input a un mensaje en español.
function getErrorMessage(input) {
  const { validity, minLength, maxLength, type } = input;

  if (validity.valid) {
    return "";
  }

  if (validity.valueMissing) {
    return "Este campo es obligatorio.";
  }

  if (validity.typeMismatch) {
    return type === "email"
      ? "Introduce un correo electrónico válido."
      : "Introduce un enlace válido que empiece por https://";
  }

  if (validity.tooShort) {
    return `Debe tener al menos ${minLength} caracteres.`;
  }

  if (validity.tooLong) {
    return `No puede superar los ${maxLength} caracteres.`;
  }

  // Cualquier otro caso: se recurre al mensaje del navegador.
  return input.validationMessage;
}

export default function useFormAndValidation(initialValues = {}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  // Se ejecuta en cada pulsación: guarda el valor, calcula el error de
  // ese campo y vuelve a comprobar la validez del formulario entero.
  function handleChange(e) {
    const input = e.target;
    const { name, value, form } = input;

    setValues((prevValues) => ({ ...prevValues, [name]: value }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: getErrorMessage(input),
    }));
    setIsValid(form.checkValidity());
  }

  // Reinicia el formulario. Se usa, por ejemplo, cuando un formulario
  // arranca ya relleno con los datos actuales del usuario y por tanto
  // debe considerarse válido desde el principio.
  const resetForm = useCallback(
    (newValues = {}, newErrors = {}, newIsValid = false) => {
      setValues(newValues);
      setErrors(newErrors);
      setIsValid(newIsValid);
    },
    [],
  );

  return { values, errors, isValid, handleChange, resetForm, setValues };
}
