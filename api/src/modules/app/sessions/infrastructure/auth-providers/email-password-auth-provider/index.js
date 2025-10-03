import jwt from "jsonwebtoken";

import UserByEmailPasswordCriteria from "../../../domain/criterias/user-by-email-password-criteria/index.js";
import InvalidCredentials from "../../../domain/exceptions/invalid-credentials/index.js";

export default class EmailPasswordAuthProvider {
  #usersLowDBDAO;

  constructor(usersLowDBDAO) {
    this.#usersLowDBDAO = usersLowDBDAO;
  }

  async authenticate(email, password) {
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
        expiresIn: "1h",
      },
    );
  }

  async isAuthenticated(token) {
    // Verify Token
  }

  async currentUser(token) {
    // TODO: get or set CurrentUser
  }
}
