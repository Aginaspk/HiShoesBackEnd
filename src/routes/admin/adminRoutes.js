import express from "express";
import {
  veridyAdminToken,
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
  .get("/users", veridyAdminToken, trycatch(getAllUsers))
  .get("/user/:id", veridyAdminToken, trycatch(getUserById))
  .patch("/user/block/:id", veridyAdminToken, trycatch(blockUser))

  .get("/products", veridyAdminToken, trycatch(getAllProducts))
  .get("/product/:id", veridyAdminToken, trycatch(getProductById))
  .post(
    "/product/create",
  
    veridyAdminToken,
    uplaod.array("images", 4),
    trycatch(createProduct)
  )
  .put(
    "/product/update/:id",
  
    veridyAdminToken,
    uplaod.array("images", 4),
    trycatch(updateProduct)
  )
  .patch(
    "/product/bin/:id",
  
    veridyAdminToken,
    trycatch(deleteProduct)
  )

  .get("/orders", veridyAdminToken, trycatch(getAllOrders))
  .get(
    "/order/user/:id",
  
    veridyAdminToken,
    trycatch(getOrdersByUser)
  )
  .get("/order/status", veridyAdminToken, trycatch(getStatus))
  .get("/order/total", veridyAdminToken, trycatch(getTotalOrders))
  .patch(
    "/order/payment/:id",
  
    veridyAdminToken,
    trycatch(updatePaymentStatus)
  )
  .patch(
    "/order/shipping/:id",
  
    veridyAdminToken,
    trycatch(updateShippingStatus)
  );


  export default routes