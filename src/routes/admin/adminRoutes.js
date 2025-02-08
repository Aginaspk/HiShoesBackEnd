import express from "express";
import {
  veridyAdminToken,
  verifyToken,
} from "../../middleware/authentication.js";
import trycatch from "../../middleware/trycatch.js";
import {
  blockUser,
  getAllUsers,
  getUserById,
} from "../../controllers/admin/adminUserController.js";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../../controllers/admin/adminProductController.js";
import {
  getAllOrders,
  getOrdersByUser,
  getStatus,
  getTotalOrders,
  updatePaymentStatus,
  updateShippingStatus,
} from "../../controllers/admin/adminOrderController.js";
import uplaod from "../../middleware/multer.js";

const routes = express.Router();

routes
  .get("/users", verifyToken, veridyAdminToken, trycatch(getAllUsers))
  .get("/user/:id", verifyToken, veridyAdminToken, trycatch(getUserById))
  .patch("/user/block/:id", verifyToken, veridyAdminToken, trycatch(blockUser))

  .get("/products", verifyToken, veridyAdminToken, trycatch(getAllProducts))
  .get("/product/:id", verifyToken, veridyAdminToken, trycatch(getProductById))
  .post(
    "/product/create",
    verifyToken,
    veridyAdminToken,
    uplaod.array("images", 4),
    trycatch(createProduct)
  )
  .put(
    "/product/update/:id",
    verifyToken,
    veridyAdminToken,
    uplaod.array("images", 4),
    trycatch(updateProduct)
  )
  .patch(
    "/product/bin/:id",
    verifyToken,
    veridyAdminToken,
    trycatch(deleteProduct)
  )

  .get("/orders", verifyToken, veridyAdminToken, trycatch(getAllOrders))
  .get(
    "/order/user/:id",
    verifyToken,
    veridyAdminToken,
    trycatch(getOrdersByUser)
  )
  .get("/order/status", verifyToken, veridyAdminToken, trycatch(getStatus))
  .get("/order/total", verifyToken, veridyAdminToken, trycatch(getTotalOrders))
  .patch(
    "/order/payment/:id",
    verifyToken,
    veridyAdminToken,
    trycatch(updatePaymentStatus)
  )
  .patch(
    "/order/shipping/:id",
    verifyToken,
    veridyAdminToken,
    trycatch(updateShippingStatus)
  );


  export default routes