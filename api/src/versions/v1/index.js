import express from "express";

import SessionsController from "../../controllers/express/v1/sessions-controller/index.js";
import UsersController from "../../controllers/express/v1/users-controller/index.js";
import bearerTokenVerifier from "../../bearer-token-verifier/index.js";

const router = express.Router();
const sessionsController = new SessionsController();
const usersController = new UsersController();

router.post("/sessions", sessionsController.create);
router.get("/sessions", sessionsController.get);

router.get("/users/current", bearerTokenVerifier, usersController.getCurrentUser);
router.patch("/users/current", bearerTokenVerifier, usersController.updateCurrentUser);

export default router;
