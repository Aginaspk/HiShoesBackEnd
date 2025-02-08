import userSchema from "../../models/schema/userSchema.js";
import CustomError from "../../utils/customError.js";

const getAllUsers = async (req, res, next) => {
  const users = await userSchema.find({ isAdmin: false }).select("-password");
  if (!users) {
    return next(new CustomError("users not found", 404));
  }
  res.status(200).json({
    users,
  });
};

const getUserById = async (req, res, next) => {
  const user = await userSchema.findOne({_id:req.params.id}).select("-password");
  if (!user) {
    return next(new CustomError("user not found", 404));
  }
  res.status(200).json({ user });
};

const blockUser = async (req, res, next) => {
  const user = await userSchema.findOne({_id:req.params.id});
  if (!user) {
    return next(new CustomError("User not Found", 404));
  }
  user.isBlocked = !user.isBlocked;
  await user.save();
  res.status(200).json({
    message: user.isBlocked ? "user blocked" : "user unblocked",
  });
};


export {getAllUsers,getUserById,blockUser}