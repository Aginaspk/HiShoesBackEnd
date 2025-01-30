import express from "express";
import tryCatch from "../../middleware/trycatch.js";
import {userReg,userLogin,userLogout} from "../../controllers/auth/authController.js";

const routes = express.Router();

routes
  .post("/signup", tryCatch(userReg))
  .post("/login", tryCatch(userLogin))
  .post("/logout", tryCatch(userLogout));

export default routes;
