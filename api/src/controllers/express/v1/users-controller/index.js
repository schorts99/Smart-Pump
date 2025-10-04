import { ValuesNotValid } from "@schorts/shared-kernel";

import EmailPasswordAuthProvider from "../../../../modules/app/sessions/infrastructure/auth-providers/email-password-auth-provider/index.js";
import UserLowDBDAO from "../../../../modules/app/users/infrastructure/daos/user-lowdb-dao/index.js";

import CurrentUserPatcher from "../../../../modules/app/users/application/current-user-patch/current-user-patcher/index.js";

import NotAuthenticated from "../../../../modules/shared/exceptions/not-authenticated/index.js";

export default class UsersController {
  #authProvider;
  #currentUserPatcher;

  constructor() {
    const userLowDBDAO = new UserLowDBDAO("../data/users.json");
    this.#authProvider = new EmailPasswordAuthProvider(userLowDBDAO);
    this.#currentUserPatcher = new CurrentUserPatcher(this.#authProvider, userLowDBDAO);
    this.getCurrentUser = this.getCurrentUser.bind(this);
    this.updateCurrentUser = this.updateCurrentUser.bind(this);
  }

  async getCurrentUser(req, res) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const currentUser = await this.#authProvider.currentUser(token);

      if (!currentUser) {
        res.status(400);

        return res.send([
          {
            status: "401",
            code: "UNAUTHORIZED",
            title: "Unauthorized",
            detail: "You need to login."
          },
        ]);
      }

      const attributes = currentUser.toPrimitives();

      delete attributes["id"];
      delete attributes["password"];

      res.status(200);
      res.send({
        data: {
          id: currentUser.id,
          type: "users",
          attributes,
        },
      });
    } catch(error) {
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

  async updateCurrentUser(req, res) {
    const token = req.headers.authorization.split(" ")[1];
    const { company, address } = req.body.data.attributes;
    const result = await this.#currentUserPatcher.patch(
      token,
      company,
      address
    );

    if (result.isSuccess()) {
      const attributes = result.getValue().toPrimitives();

      delete attributes["id"];
      delete attributes["password"];

      res.status(200);
      res.send({
        data: {
          id: result.id,
          type: "users",
          attributes,
        },
      });
    } else {
      const error = result.getError();

      if (error instanceof NotAuthenticated) {
        res.status(401);

        return res.send([
          {
            status: "401",
            code: "UNAUTHORIZED",
            title: "Unauthorized",
            detail: "You need to login."
          },
        ]);
      } else if (error instanceof ValuesNotValid) {
        res.status(400);
        
        const errors = error.errors.map((error) => ({
          status: "400",
          code: `${error.attributeName.toUpperCase()}_NOT_VALID`,
          title: `${error.attributeName} Not Valid`,
          detail: `${error.message}`,
          source: {
            pointer: `/data/attributes/${error.attributeName}`,
          },
        }));

        return res.send({ errors });
      }

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
