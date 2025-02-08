import productSchema from "../../models/schema/productSchema.js";
import CustomError from "../../utils/customError.js";
import { joiProductSchema } from "../../models/joischema/validation.js";

const createProduct = async (req, res, next) => {
  const { value, error } = joiProductSchema.validate(req.body);
  if (error) {
    return next(new CustomError(error.details[0].message, 400));
  }
  if (!req.files || !req.files.length === 0) {
    return next(new CustomError("image not found"));
  }
  const imagePaths = req.files.map((file) => file.path);

  const sizesArray = Array.isArray(req.body.sizes)
      ? req.body.sizes.map(Number)
      : req.body.sizes.split(",").map(Number);

  const newProduct = new productSchema({
    ...value,
    sizes:sizesArray,
    images: imagePaths,
  });
  if (!newProduct) {
    return next(new CustomError("product is not created", 500));
  }
  await newProduct.save();
  res.status(201).json({
    message: "Product created successfully",
  });
};






const updateProduct = async (req, res, next) => {
  const existingProduct = await productSchema.findById({_id:req.params.id});
  if (!existingProduct) {
    return next(new CustomError("Product not found", 404));
  }

  let images = existingProduct.images;
  if (req.files && req.files.length > 0) {
    images = req.files.map((file) => file.path);
  }

  const sizesArray = Array.isArray(req.body.sizes)
  ? req.body.sizes.map(Number)
  : req.body.sizes.split(",").map(Number);

  existingProduct.set({
    ...req.body,
    sizes:sizesArray,
    images: images,
  });

  await existingProduct.save();
  res.status(200).json({
    message: "Product updated successfully",
  });
};

const deleteProduct = async (req, res, next) => {
  const deletedProduct = await productSchema.findByIdAndUpdate(
    req.params.id,
    { $set: { isDeleted: true } },
    { new: true }
  );
  if (!deletedProduct) {
    return next(new CustomError("Product not found", 404));
  }

  res.status(200).json({
    message: "product deleted successfully",
  });
};

const getAllProducts = async (req, res, next) => {
  const products = await productSchema.find();
  if (!products) {
    return next(new CustomError("Products not found"));
  }
  res.status(200).json({
    message: "product found successfully",
    data: products,
  });
};

const getProductById = async (req, res, next) => {
  const product = await productSchema.findOne({_id:req.params.id});
  if (!product) {
    return next(new CustomError("Product not found", 404));
  }
  res.status(200).json({
    message: "product found successfully",
    data: product,
  });
};

export {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
};
