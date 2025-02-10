import Stripe from "stripe";
import orderShema from "../../models/schema/orderShema.js";
import cartSchema from "../../models/schema/cartSchema.js";
import CustomError from "../../utils/customError.js";
import mongoose from "mongoose";
import productSchema from "../../models/schema/productSchema.js";

const orderCOD = async (req, res, next) => {
  const newOrder = await new orderShema({
    ...req.body,
    userId: req.user.id,
  }).populate("products.productId", "name price images");
  console.log(req.body);

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
  res
    .status(201)
    .json({ message: "order placed succesfully", order: newOrder });
};

const orderWithStripe = async (req, res, next) => {
  const { products, totalAmount } = req.body;
  if (!products || products.length === 0) {
    return next(new CustomError("No products found", 404));
  }
  const productDetails = await Promise.all(
    products.map(async (item) => {
      const product = await productSchema.findById(item.productId);
      if (!product) {
        return next(new CustomError("product not found", 404));
      }
      return {
        name: product.name,
        price: product.price,
        images: product.images,
        quantity: item.quantity,
      };
    })
  );
  const newTotal = Math.round(totalAmount);

  const lineItem = productDetails.map((item) => ({
    price_data: {
      currency: "inr",
      product_data: {
        name: item.name,
        images: item.images,
      },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  }));

  const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);
  const session = await stripeClient.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItem,
    mode: "payment",
    success_url: `http://localhost:3000/success/{CHECKOUT_SESSION_ID}`,
    cancel_url: `http://localhost:3000/cancel`,
  });
  const newOrder = new orderShema({
    userId: req.user.id,
    products,
    totalAmount: newTotal,
    paymentStatus: "pending",
    shippingStatus: "processing",
    paymentMethod: "stripe",
    sessionId: session.id,
  });
  await newOrder.save();

  res.status(200).json({
    message: "order placed succesfully",
    sessionId: session.id,
    stripeURL: session.url,
  });
};

const stripeSuccess = async (req, res, next) => {
  const sessionId = req.params.sessionId;
  const order = await orderShema.findOne({ sessionId: sessionId });
  if (!order) return next(new CustomError("order not found", 404));
  order.paymentStatus = "paid";
  order.shippingStatus = "processing";
  await order.save();

  await cartSchema.findOneAndUpdate(
    { userId: order.userId },
    { $set: { products: [] } }
  );

  res.status(200).json({
    message: "payment succesfull",
  });
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

export { orderCOD, getAllOrders, cancelOrderById, orderWithStripe,stripeSuccess };
