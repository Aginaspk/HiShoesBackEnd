import wishListSchema from "../../models/schema/wishListSchema.js";
import CustomError from "../../utils/customError.js";

const getUserWishlist = async (req, res) => {
  const data = await wishListSchema
    .findOne({ userId: req.user.id })
    .populate("products");

  if (data) {
    return res.status(200).json({
      status: "success",
      data: data,
    });
  } else {
    res.status(200).json({
      products: [],
    });
  }
};

const addToWishlist = async (req, res, next) => {
  const { productId } = req.body;

  if (!productId) {
    return next(new CustomError("product id is required"));
  }

  try {
    let wishlist = await wishListSchema.findOne({ userId: req.user.id });
    if (!wishlist) {
      wishlist = new wishListSchema({
        userId: req.body.id,
        products: [productId],
      });
    } else if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
    }

    await wishlist.save();

    res.status(200).json({
      message: "product added to wish list",
      wishlist,
    });
  } catch (error) {
    next(new CustomError("failed to add products to wishlist", 500));
  }
};

const removeFromWishlist = async (req, res, next) => {
  const { productId } = req.body;
  if (!productId) {
    return next(new CustomError("product is required", 400));
  }
  const newWishlist = await wishListSchema.findOneAndUpdate(
    { userId: req.user.id },
    { $pull: { productId: productId } },
    { new: true }
  );
  if (newWishlist) {
    res.status(200).json({ message: "product removed from wishlist" });
  } else {
    next(new CustomError("product not found in wishlist", 404));
  }
};

export {getUserWishlist,removeFromWishlist,addToWishlist};
