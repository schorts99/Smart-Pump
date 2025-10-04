import EmailPasswordAuthProvider from "../../../../modules/app/sessions/infrastructure/auth-providers/email-password-auth-provider/index.js";
import UserLowDBDAO from "../../../../modules/app/users/infrastructure/daos/user-lowdb-dao/index.js";

export default class UsersController {
  #authProvider;

  constructor() {
    const userLowDBDAO = new UserLowDBDAO("../data/users.json");

    this.#authProvider = new EmailPasswordAuthProvider(userLowDBDAO);
    this.getCurrentUser = this.getCurrentUser.bind(this);
  }

  async getCurrentUser(req, res) {
    try {
      const bearerToken = req.headers.authorization;

      if (!bearerToken) {
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

      const token = bearerToken.split(" ")[1];
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
}
