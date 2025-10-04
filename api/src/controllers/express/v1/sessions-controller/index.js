import EmailPasswordAuthProvider from "../../../../modules/app/sessions/infrastructure/auth-providers/email-password-auth-provider/index.js";
import UserLowDBDAO from "../../../../modules/app/users/infrastructure/daos/user-lowdb-dao/index.js";

import InvalidCredentials from "../../../../modules/app/sessions/domain/exceptions/invalid-credentials/index.js";
import AlreadyAuthenticated from "../../../../modules/app/sessions/domain/exceptions/already-authenticated/index.js";

export default class SessionsController {
  #authProvider;

  constructor() {
    const userLowDBDAO = new UserLowDBDAO("../data/users.json");

    this.#authProvider = new EmailPasswordAuthProvider(userLowDBDAO);
    this.create = this.create.bind(this);
    this.get = this.get.bind(this);
  }

  async create(req, res) {
    try {
      const bearerToken = req.headers.authorization;
      let token;

      if (bearerToken) {
        token = bearerToken.split(" ")[1];
      }

      const { email, password } = req.body.data.attributes;
      token = await this.#authProvider.authenticate(email, password, token);

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
      } else if (error instanceof AlreadyAuthenticated) {
        res.status(400);
        res.send([
          {
            status: "400",
            code: "ALREADY_AUTHENTICATED",
            title: "Already Authenticated",
            detail: "You already have a session."
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

  async get(req, res) {
    try {
      res.status(200);

      const bearerToken = req.headers.authorization;

      if (!bearerToken) {
        return res.send({
          data: {
            type: "sessions",
            attributes: {
              active: false,
            },
          },
        });
      }

      const token = bearerToken.split(" ")[1];
      const isAuthenticated = await this.#authProvider.isAuthenticated(token);

      res.send({
        data: {
          type: "sessions",
          attributes: {
            active: isAuthenticated,
          },
        },
      });
    } catch (error) {
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
