import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  price: { type: Number, required: true },
  sale: { type: Number, required: true },
  images: [{ type: String, required: true, trim: true }],
  brand: { type: String, required: true, trim: true },
  sizes: [{ type: Number, required: true }],
  gender: { type: String, required: true, trim: true },
  sold: { type: Number, required: true },
  isDeleted: { type: Boolean, default: false },
});

export default mongoose.model("product", productSchema);
