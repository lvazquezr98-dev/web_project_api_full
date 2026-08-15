// ============================================================
// api.js — SOLICITUDES A NUESTRA PROPIA API
// ============================================================
// Todas las peticiones de la funcionalidad principal (perfil, tarjetas
// y "me gusta") viajan a nuestro back-end y van AUTORIZADAS: llevan el
// JWT del usuario en el encabezado Authorization con el formato
// "Bearer <token>".
//
// El token no se guarda en el constructor: se lee del almacenamiento
// local en cada petición con _getHeaders(). Si se guardara una sola vez
// al crear la instancia, después de iniciar sesión seguiríamos mandando
// el token viejo (o ninguno) hasta recargar la página.
// ============================================================

import { BASE_URL } from "./config";
import { getToken } from "./token";

class Api {
  constructor({ baseUrl }) {
    this._baseUrl = baseUrl;
  }

  // Encabezados de cada petición, con el token actual del usuario.
  _getHeaders() {
    return {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    };
  }

  // Nuestro back-end responde siempre { message: "..." } cuando algo falla,
  // así que propagamos ese mensaje en vez de un "Error: 400" sin contexto.
  _handleResponse(res) {
    if (res.ok) {
      return res.json();
    }

    return res
      .json()
      .catch(() => ({}))
      .then((data) =>
        Promise.reject(new Error(data.message || `Error: ${res.status}`)),
      );
  }

  _request(endpoint, options = {}) {
    return fetch(this._baseUrl + endpoint, {
      ...options,
      headers: this._getHeaders(),
    }).then((res) => this._handleResponse(res));
  }

  getUserInfo() {
    return this._request("/users/me", { method: "GET" });
  }

  getInitialCards() {
    return this._request("/cards", { method: "GET" });
  }

  updateUserInfo({ name, about }) {
    return this._request("/users/me", {
      method: "PATCH",
      body: JSON.stringify({ name, about }),
    });
  }

  addCard({ name, link }) {
    return this._request("/cards", {
      method: "POST",
      body: JSON.stringify({ name, link }),
    });
  }

  addLike(cardId) {
    return this._request(`/cards/${cardId}/likes`, { method: "PUT" });
  }

  removeLike(cardId) {
    return this._request(`/cards/${cardId}/likes`, { method: "DELETE" });
  }

  changeLikeCardStatus(cardId, isLiked) {
    return isLiked ? this.addLike(cardId) : this.removeLike(cardId);
  }

  deleteCard(cardId) {
    return this._request(`/cards/${cardId}`, { method: "DELETE" });
  }

  updateAvatar(avatar) {
    return this._request("/users/me/avatar", {
      method: "PATCH",
      body: JSON.stringify({ avatar }),
    });
  }
}

const api = new Api({ baseUrl: BASE_URL });

export default api;
