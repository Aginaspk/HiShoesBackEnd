import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, trim: true },
  profileImg: { type: String, trim: true },
  isAdmin: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
});

module.exports = mongoose.model("user",userSchema);