import express from "express";
import trycatch from "../../middleware/trycatch.js";
import {
  getAllProducts,
  getProductsById,
} from "../../controllers/user/userProductController.js";
import {
  updateUserCart,
  getUserCart,
  removeFromCart,
} from "../../controllers/user/cartController.js";
import { verifyToken } from "../../middleware/authentication.js";

const routes = express.Router();

routes

  // product
  .get("/products", trycatch(getAllProducts))
  .get("/product/:id", trycatch(getProductsById))

  // cart
  .get("/cart", verifyToken, trycatch(getUserCart))
  .post("/cart", verifyToken, trycatch(updateUserCart))
  .delete("/cart", verifyToken, trycatch(removeFromCart));

export default routes;
