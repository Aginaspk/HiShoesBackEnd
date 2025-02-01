import orderShema from "../../models/schema/orderShema.js";
import cartSchema from "../../models/schema/cartSchema.js";
import CustomError from "../../utils/customError.js";
import mongoose from "mongoose";
import Stripe from "stripe";
import productSchema from "../../models/schema/productSchema.js";

const orderCOD = async (req, res, next) => {
  const newOrder = await new orderShema({
    ...req.body,
    userId: req.user.id,
  }).populate("products.productId", "name price images");
  console.log(req.body)

  if (!newOrder) {
    return next(new CustomError("order not created", 400));
  }
  const unavailableProduct = await productSchema.find({
    _id: { $in: newOrder.products.map((product) => product.productId) },
    isDeleted: true,
  });
  if (!unavailableProduct) {
    return next(new CustomError("product is not available", 404));
  }

  newOrder.paymentStatus = "Cash on delivery";
  newOrder.shippingStatus = "processing";

  let currentUserCart = await cartSchema.findOneAndUpdate(
    { userId: req.user.id },
    { $set: { products: [] } },
    { new: true }
  );
  if (currentUserCart) {
    await currentUserCart.save();
  }
  await newOrder.save();
  res.status(201).json({ message: "order placed succesfully",order:newOrder });
};

const getAllOrders = async (req, res, next) => {
  const orders = await orderShema
    .find({ userId: req.user.id })
    .populate("products.productId", "name price image")
    .sort({ createdAt: -1 });

  if (orders) {
    res.status(200).json({
      data: { orders: orders },
    });
  } else {
    res.status(200).json({
      data: { orders: [] },
    });
  }
};

const cancelOrderById = async (req, res, next) => {
  const cancelOrder = await orderShema.findOneAndUpdate(
    {
      _id: req.params.id,
      userId: req.user.id,
    },
    { $set: { shippingStatus: "canceled" } },
    { new: true }
  );
  if (!cancelOrder) {
    return next(new CustomError("order not found", 404));
  }
  if (cancelOrder.paymentStatus === "paid") {
    return next(new CustomError("order already payed", 400));
  }
  cancelOrder.shippingStatus = "cancelled";
  cancelOrder.paymentStatus = "cancelled";

  res.status(200).json({
    message: "Order cancelled successfully",
  });
};



export {orderCOD,getAllOrders,cancelOrderById};