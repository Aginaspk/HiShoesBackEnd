import user from "../../models/schema/userSchema.js";
import {
  joiUserLogin,
  joiUserSchema,
} from "../../models/joischema/validation.js";
import bycrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import customError from "../../utils/customError.js";

// const createToken = (id, isAdmin) => {
//   return jwt.sign({ id, isAdmin }, process.env.JWT_TOKEN, {
//     expiresIn: "7d",
//   });
// };

// const createRefreshtoken = (id, isAdmin) => {
//   return jwt.sign({ id, isAdmin }, process.env.JWT_TOKEN, {
//     expiresIn: "14d",
//   });
// };

const createAdminToken = (id) => {
  return jwt.sign({ id, isAdmin: true }, process.env.JWT_TOEKN_ADMIN, {
    expiresIn: "7d",
  });
};

// Function to create a User token
const createUserToken = (id) => {
  return jwt.sign({ id, isAdmin: false }, process.env.JWT_TOKEN_USER, {
    expiresIn: "7d",
  });
};

// Function to create Admin Refresh Token
const createAdminRefreshToken = (id) => {
  return jwt.sign({ id, isAdmin: true }, process.env.JWT_TOEKN_ADMIN, {
    expiresIn: "14d",
  });
};

// Function to create User Refresh Token
const createUserRefreshToken = (id) => {
  return jwt.sign({ id, isAdmin: false }, process.env.JWT_TOKEN_USER, {
    expiresIn: "14d",
  });
};

const userReg = async (req, res, next) => {
  const { value, error } = joiUserSchema.validate(req.body);

  if (error) {
    return next(new customError(error.details[0].message, 400));
  }

  const { name, email, password } = value;
  const existUser = await user.findOne({ email });
  if (existUser) {
    return next(new customError("user already exist", 400));
  }

  const salt = await bycrypt.genSalt(8);
  const hashedPassword = await bycrypt.hash(password, salt);
  const newUser = new user({
    name,
    email,
    password: hashedPassword,
  });
  await newUser.save();

  res.status(200).json({
    status: "success",
    message: "user registered successfully",
  });
};

const userLogin = async (req, res, next) => {
  const { value, error } = joiUserLogin.validate(req.body);

  if (error) {
    return res.status(400).json({
      status: "error",
      message: error.details[0].message,
    });
  }

  const { email, password } = value;
  const userData = await user.findOne({ email });
  if (!userData) {
    return next(new customError("user not found", 404));
  }
  if (userData.isBlocked) {
    return next(new customError("user is blocked", 403));
  }

  if (userData.isAdmin) {
    return next(
      new customError(
        "access denied please use another eamil, this eamil already taken ",
        403
      )
    );
  }
  const isMatch = await bycrypt.compare(password, userData.password);
  if (!isMatch) {
    return next(new customError("password is incorrect", 401));
  }

  const token = createUserToken(userData._id);
  const refreshtoken = createUserRefreshToken(userData._id);

  res.cookie("refreshtoken", refreshtoken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    status: "used logged in successfully",
    isAdmin: userData.isAdmin,
    token,
  });
};

const adminLogin = async (req, res, next) => {
  const { value, error } = joiUserLogin.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: "error",
      message: error.details[0].message,
    });
  }

  const { email, password } = value;
  const adminData = await user.findOne({ email, isAdmin: true });
  if (!adminData) {
    return next(new customError("admin not found or unotherised", 404));
  }

  const isMatch = await bycrypt.compare(password, adminData.password);
  if (!isMatch) {
    return next(new customError("password is incorrect", 401));
  }
  const token = createUserToken(adminData._id);
  const refreshtoken = createUserRefreshToken(adminData._id);

  // res.cookies("refreshtoken", refreshtoken, {
  //   httpOnly: true,
  //   secure: true,
  //   sameSite: "none",
  //   maxAge: 7 * 24 * 60 * 60 * 1000,
  // });
  res.status(200).json({
    message: "admin loggedIn successfully",
    token,
  });
};

const userLogout = async (req, res, next) => {
  res.clearCookie("refreshtoken", {
    httpOnly: true,
    secure: false,
    sameSite: "none",
  });
  res.status(200).json({
    message: "loggedout succesfully",
  });
};

export { userReg, userLogin, adminLogin, userLogout };
