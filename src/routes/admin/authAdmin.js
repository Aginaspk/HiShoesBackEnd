import express from "express";
import trycatch from "../../middleware/trycatch.js";
import { adminLogin, adminLogout } from "../../controllers/auth/authController.js";

const routes = express.Router();

routes.post("/login", trycatch(adminLogin));
routes.post('/logout',trycatch(adminLogout));

export default routes;