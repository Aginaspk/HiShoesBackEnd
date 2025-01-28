import products from "../../models/schema/productSchema";

const getAllProducts = async (req, res) => {
  const allProducts = await products.find();

  res.status(200).json({
    status: "success",
    message: "all product get successfully",
    data: allProducts,
  });
};

const getProductsById = async (req, res) => {
  const _id = req.params;
  const productById = await products.findById(_id);
  res.status(200).json({
    status: "success",
    message: "product get by id successfully",
    data: productById,
  });
};

module.exports = { getAllProducts, getProductsById };
