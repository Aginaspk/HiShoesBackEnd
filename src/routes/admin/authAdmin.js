import express from "express";
import trycatch from "../../middleware/trycatch.js";
import { adminLogin } from "../../controllers/auth/authController.js";

const routes = express.Router();

routes.post("/login", trycatch(adminLogin));

export default routes;