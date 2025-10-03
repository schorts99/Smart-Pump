import EmailPasswordAuthProvider from "../../../../modules/app/sessions/infrastructure/auth-providers/email-password-auth-provider/index.js";
import UserLowDBDAO from "../../../../modules/app/users/infrastructure/daos/user-lowdb-dao/index.js";

import InvalidCredentials from "../../../../modules/app/sessions/domain/exceptions/invalid-credentials/index.js";

export default class SessionsController {
  #emailPasswordAuthProvider;

  constructor() {
    const userLowDBDAO = new UserLowDBDAO("../data/users.json");

    this.#emailPasswordAuthProvider = new EmailPasswordAuthProvider(userLowDBDAO);;
    this.create = this.create.bind(this);
  }

  async create(req, res) {
    try {
      const { email, password } = req.body.data.attributes;
      const token = await this.#emailPasswordAuthProvider.authenticate(email, password);

      res.status(201);
      res.send({
        data: {
          type: "sessions",
          attributes: {
            token
          }
        },
      });
    } catch (error) {
      if (error instanceof InvalidCredentials) {
        res.status(400);
        res.send([
          {
            status: "400",
            code: "INVALID_CREDENTIALS",
            title: "Invalid Credentials",
            detail: "Please verify your credentials."
          },
        ]);
      } else {
        res.status(500);
        res.send([
          {
            status: "500",
            code: "INTERNAL_SERVER_ERROR",
            title: "Internal Server Error",
            detail: "Please try again later."
          },
        ]);
      }
    }
  }
}
