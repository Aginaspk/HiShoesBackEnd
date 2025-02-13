import products from "../../models/schema/productSchema.js";

const getAllProducts = async (req, res) => {
  const allProducts = await products.find();

  res.status(200).json({
    status: "success",
    message: "all product get successfully",
    data: allProducts,
  });
};

const getProductsById = async (req, res) => {
  const { id } = req.params;

  const productById = await products.findById(id);
  console.log(productById);

  res.status(200).json({
    status: "success",
    message: "product get by id successfully",
    data: productById,
  });
};

const getMostSelling = async (req, res, next) => {
  const mostSellingProducts = await products.find().sort({ sold: -1 }).limit(5);
  res.status(200).json({
    status: "success",
    message: "product get by id successfully",
    data: mostSellingProducts,
  });
};

const getNewProducts = async (req, res, next) => {
  const newProducts = await products.find().sort({ createdAt: -1 }).limit(4);
  res.status(200).json({
    status: "success",
    message: "product get by id successfully",
    data: newProducts,
  });
};

const getProductsWithCategory = async (req, res) => {
  const { category } = req.params;
  let productsByCategory = [];
  if (category === "sale") {
    productsByCategory = await products.find({ sale: { $gt: 0 } });
  } else if (category === "all") {
    productsByCategory = await products.find();
  } else {
    productsByCategory = await products.find({ gender: category });
  }

  res.status(200).json({
    status: "success",
    message: "Products with offers fetched successfully",
    data: productsByCategory,
  });
};
export {
  getAllProducts,
  getProductsById,
  getMostSelling,
  getNewProducts,
  getProductsWithCategory,
};
