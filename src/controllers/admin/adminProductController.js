import productSchema from "../../models/schema/productSchema";
import CustomError from "../../utils/customError";
import { joiProductSchema } from "../../models/joischema/validation";

const createProduct = async (req, res, next) => {
  const { value, error } = joiProductSchema.validate(req.body);
  if (error) {
    return next(new CustomError(error.details[0].message, 400));
  }
  if (!req.files || !req.files.length === 0) {
    return next(new CustomError("image not found"));
  }
  const imagePaths = req.files.map((file) => file.path);

  const newProduct = new product({
    ...value,
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
  const existingProduct = await productSchema.findById(req.params.id);
  if (!existingProduct) {
    return next(new CustomError("Product not found", 404));
  }

  let images = existingProduct.images;
  if (req.files && req.files.length > 0) {
    images = req.files.map((file) => file.path);
  }

  existingProduct.set({
    ...req.body,
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
  const products = await productSchema.find({ isDeleted: false });
  if (!products) {
    return next(new CustomError("Products not found"));
  }
  res.status(200).json({
    message: "product found successfully",
    data: products,
  });
};

const getProductById = async (req, res, next) => {
  const product = await productSchema.findOne(req.params.id);
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
