import { SESSIONS_URL, CURRENT_USER_URL } from "../../../api-routes";

import AlreadyAuthenticated from "../../domain/exceptions/already-authenticated";
import NotAuthenticated from "../../domain/exceptions/not-authenticated";
import User from "../../../users/domain/entities/user";

export default class EmailPasswordAuthProvider {
  #jsonAPIConnector;
  static #authChangeListeners = new Set();
  static #isAuthenticated;
  static #currentUser;

  constructor(jsonAPIConnector) {
    this.#jsonAPIConnector = jsonAPIConnector;
  }

  async authenticate(email, password) {
    if (EmailPasswordAuthProvider.#isAuthenticated === true) {
      throw new AlreadyAuthenticated();
    }

    const { data: { attributes: { token } } } = await this.#jsonAPIConnector.create(SESSIONS_URL, {
      type: "sessions",
      attributes: { email, password },
    });

    sessionStorage.setItem("token", token);
    this.#notifyAuthChange(true);
  }

  async logout() {
    if (EmailPasswordAuthProvider.#isAuthenticated !== true) {
      throw new NotAuthenticated();
    }

    await this.#jsonAPIConnector.delete(SESSIONS_URL);

    this.#notifyAuthChange(false);
  }

  async isAuthenticated() {
    if (EmailPasswordAuthProvider.#isAuthenticated !== undefined) {
      return EmailPasswordAuthProvider.#isAuthenticated;
    }
    
    const { data: { attributes: { active } } } = await this.#jsonAPIConnector.findOne(SESSIONS_URL);

    if (!active && sessionStorage.getItem("token")) {
      sessionStorage.removeItem("token");
    }

    this.#notifyAuthChange(active);

    return active;
  }

  async currentUser() {
    if (EmailPasswordAuthProvider.#isAuthenticated === undefined) {
      if (!(await this.isAuthenticated())) {
        return null;
      }
    }

    if (EmailPasswordAuthProvider.#currentUser !== undefined) {
      return EmailPasswordAuthProvider.#currentUser;
    }

    const { data } = await this.#jsonAPIConnector.findOne(CURRENT_USER_URL);

    return User.fromPrimitives({ id: data.id, ...data.attributes });
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
