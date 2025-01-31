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
  const {id} = req.params;
 
  const productById = await products.findById(id);
  console.log(productById);
  
  res.status(200).json({
    status: "success",
    message: "product get by id successfully",
    data: productById,
  });
};
export { getAllProducts, getProductsById };
