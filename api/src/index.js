import express from "express";
import dotenv from "dotenv";

dotenv.config();

import "./register-entities.js"
import v1 from "./versions/v1/index.js";

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use("/api/v1", v1);

app.listen(port);
