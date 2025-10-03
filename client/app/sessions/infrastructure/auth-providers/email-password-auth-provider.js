import { SESSIONS_URL } from "../../../api-routes";

import AlreadyAuthenticated from "../../domain/exceptions/already-authenticated";
import NotAuthenticated from "../../domain/exceptions/not-authenticated";

export default class EmailPasswordAuthProvider {
  #jsonAPIConnector;
  static #authChangeListeners = new Set();
  static #isAuthenticated = false;

  constructor(jsonAPIConnector) {
    this.#jsonAPIConnector = jsonAPIConnector;
  }

  async authenticate(email, password) {
    if (EmailPasswordAuthProvider.#isAuthenticated) {
      throw new AlreadyAuthenticated();
    }

    await this.#jsonAPIConnector.create(SESSIONS_URL, {
      type: "sessions",
      attributes: { email, password },
    });

    this.#notifyAuthChange(true);
  }

  async logout() {
    if (!EmailPasswordAuthProvider.#isAuthenticated) {
      throw new NotAuthenticated();
    }

    await this.#jsonAPIConnector.delete(SESSIONS_URL);

    this.#notifyAuthChange(false);
  }

  async isAuthenticated() {
    return EmailPasswordAuthProvider.#isAuthenticated;
  }

  async currentUser() {
    if (!EmailPasswordAuthProvider.#isAuthenticated) {
      return null;
    }

    // TODO: get or set CurrentUser
  }

  onAuthChange(callback) {
    EmailPasswordAuthProvider.#authChangeListeners.add(callback);

    return () => EmailPasswordAuthProvider.#authChangeListeners.delete(callback);
  }

  #notifyAuthChange(isAuthenticated) {
    for (const listener of EmailPasswordAuthProvider.#authChangeListeners) {
      listener(isAuthenticated);
    }
  }
}
