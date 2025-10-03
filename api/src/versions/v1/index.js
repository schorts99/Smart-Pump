import express from "express";

import SessionsController from "../../controllers/express/v1/sessions-controller/index.js";

const router = express.Router();
const sessionsController = new SessionsController();

router.post("/sessions", sessionsController.create)

export default router;
