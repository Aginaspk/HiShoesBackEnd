import express from "express";
import trycatch from "../../middleware/trycatch";
import { adminLogin } from "../../controllers/auth/authController";

const routes = express.Router();

routes.post("/login", trycatch(adminLogin));

export default routes;