import jwt from "jsonwebtoken";

import UserByEmailPasswordCriteria from "../../../domain/criterias/user-by-email-password-criteria/index.js";
import InvalidCredentials from "../../../domain/exceptions/invalid-credentials/index.js";
import AlreadyAuthenticated from "../../../domain/exceptions/already-authenticated/index.js";

export default class EmailPasswordAuthProvider {
  #usersLowDBDAO;

  constructor(usersLowDBDAO) {
    this.#usersLowDBDAO = usersLowDBDAO;
  }

  async authenticate(email, password) {
    if (await this.isAuthenticated) {
      throw new AlreadyAuthenticated();
    }

    const userByEmailPasswordCriteria = new UserByEmailPasswordCriteria(
      email, password,
    )
    const user = await this.#usersLowDBDAO.findOneBy(userByEmailPasswordCriteria);

    if (!user) {
      throw new InvalidCredentials();
    }
    
    return jwt.sign(
      {
        id: user.id,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "15m",
      },
    );
  }

  isAuthenticated(token) {
    return new Promise((resolve) => {
      jwt.verify(token, process.env.SECRET_KEY, (err) => {
        if (err) {
          return resolve(false);
        }

        resolve(true);
      });
    });
  }

  async currentUser(token) {
    // TODO: get or set CurrentUser
  }
}
