import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      red: "user",
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "user",
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    purchaseDate: {
      type: Date,
      default: Date.now,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      default: "pending",
      enum: ["pending", "paid", "failed", "Cash on delivery"],
    },
    shippingStatus: {
      type: String,
      default: "pending",
      enum: ["pending", "paid", "failed", "Cash on delivery"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("order",orderSchema)