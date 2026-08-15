// ============================================================
// likes.js — ¿ESTA TARJETA TIENE MI "ME GUSTA"?
// ============================================================
// Nuestro back-end devuelve las tarjetas con un array likes que
// contiene los _id de quienes dieron "me gusta":
//
//   { _id: "...", name: "...", likes: ["6a6d...", "7b8c..."] }
//
// (La API prefabricada de sprints anteriores devolvía en su lugar un
// booleano isLiked, por eso hace falta esta función.)
//
// Vive en su propio módulo porque la usan tanto Card.jsx, para pintar
// el corazón, como App.jsx, para decidir si hay que poner o quitar el
// "me gusta" al pulsarlo.
// ============================================================

export default function isCardLikedBy(card, userId) {
  if (!card?.likes || !userId) {
    return false;
  }

  // Los elementos de likes son ObjectId serializados como cadenas, pero si
  // alguna ruta llegara a devolverlos poblados serían objetos con _id.
  return card.likes.some((like) => (like?._id ?? like) === userId);
}
