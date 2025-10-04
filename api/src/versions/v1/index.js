import express from "express";

import SessionsController from "../../controllers/express/v1/sessions-controller/index.js";

const router = express.Router();
const sessionsController = new SessionsController();

router.post("/sessions", sessionsController.create);
router.get("/sessions", sessionsController.get);
router.get("/sessions/current-user", sessionsController.getCurrentUser);

export default router;
