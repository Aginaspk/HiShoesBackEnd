import orderShema from "../../models/schema/orderShema";
import CustomError from "../../utils/customError";

const getAllOrders = async (req, res, next) => {
  const orders = await orderShema
    .find()
    .populate("products.productId", "name price images")
    .sort({ createdAt: -1 });

  if (!orders) {
    res.status(404).json({ message: "no orders found" });
  }

  res.status(200).json({
    data: orders,
  });
};

const getOrdersByUser = async (req, res, next) => {
  const orders = await orderShema
    .find({ userId: req.params.id })
    .populate("products.productId", "name price images")
    .sort({ createdAt: -1 });

  if (!orders) {
    return res.status(404).json({ message: "No orders found" });
  }

  res.status(200).json({ data: orders });
};

const getTotalOrders = async (req, res, next) => {
  const confirmedOrders = await orderShema.aggregate([
    { $match: { shippingStatus: { $ne: "cancelled" } } },
    { $count: "confirmedOrders" },
  ]);
  if (!confirmedOrders) {
    return res.status(404).json({ message: "no orders found" });
  }
  res.status(200).json({ data: confirmedOrders[0].confirmedOrders });
};

const updateShippingStatus = async (req, res, next) => {
  const order = await orderShema.findOneAndUpdate(
    { _id: req.params.id },
    { $set: { shippingStatus: req.body.shippingStatus } },
    { new: true }
  );
  if (!order) {
    return next(new CustomError("Order not found", 404));
  }
  res
    .status(200)
    .json({ message: "order shipping status updated succesfully" });
};

const updatePaymentStatus = async (req, res, next) => {
  const order = await orderShema.findOneAndUpdate(
    { _id: req.params.id },
    { $set: { paymentStatus: req.body.paymentStatus } },
    { new: true }
  );
  if (!order) {
    return next(new CustomError("order not found", 404));
  }
  res.status(200).json({ message: "payemnt status updated succesfully" });
};

const getStatus = async (req, res, next) => {
  const toatlStatus = await orderShema.aggregate([
    { $match: { shippingStatus: { $ne: "cancelled" } } },
    { $unwind: "$products" },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalAmount" },
        toatalSales: { $sum: 1 },
        totalProductsSold: { $sum: 1 },
      },
    },
  ]);

  if (!toatlStatus.length === 0) {
    return res.status(404).json({ message: "No orders found" });
  }
  res.status(200).json({
    data: {
      totalRevenue: toatlStatus[0].totalRevenue,
      toatalSales: toatlStatus[0].toatalSales,
      totalProductsSold: toatlStatus[0].totalProductsSold,
    },
  });
};

export {
  getAllOrders,
  getOrdersByUser,
  getStatus,
  getTotalOrders,
  updatePaymentStatus,
  updateShippingStatus,
};
