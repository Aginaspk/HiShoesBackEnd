import express from "express";
import trycatch from "../../middleware/trycatch.js";
import {
  getAllProducts,
  getMostSelling,
  getNewProducts,
  getProductsById,
  getProductsWithCategory,
} from "../../controllers/user/userProductController.js";
import {
  updateUserCart,
  getUserCart,
  removeFromCart,
} from "../../controllers/user/cartController.js";
import { verifyToken } from "../../middleware/authentication.js";
import { addToWishlist, getUserWishlist, removeFromWishlist } from "../../controllers/user/userWishlistController.js";
import { cancelOrderById, getAllOrders, orderCOD, orderWithStripe, stripeSuccess } from "../../controllers/user/userOrderController.js";

const routes = express.Router();

routes

  // product
  .get("/products", trycatch(getAllProducts))
  .get("/product/:id", trycatch(getProductsById))
  .get('/products/mostSelling',trycatch(getMostSelling))
  .get('/products/new',trycatch(getNewProducts))
  .get('/products/:category',trycatch(getProductsWithCategory))

  // cart
  .get("/cart", verifyToken, trycatch(getUserCart))
  .post("/cart", verifyToken, trycatch(updateUserCart))
  .delete("/cart/:id", verifyToken, trycatch(removeFromCart))

  // wishlist
  .get('/wishlist',verifyToken,trycatch(getUserWishlist))
  .post('/wishlist',verifyToken,trycatch(addToWishlist))
  .delete('/wishlist/:id',verifyToken,trycatch(removeFromWishlist))


  // Order
  .get('/order',verifyToken,trycatch(getAllOrders))
  .post('/order/cod',verifyToken,trycatch(orderCOD))
  .post('/order/stripe/checkout',verifyToken,trycatch(orderWithStripe))
  .patch('/order/stripe/success/:sessionId',verifyToken,trycatch(stripeSuccess))
  .patch('/order/cancel/:id',verifyToken,trycatch(cancelOrderById))


  
export default routes;
