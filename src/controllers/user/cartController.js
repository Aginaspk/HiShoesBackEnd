import cart from "../../models/schema/cartSchema.js";

const getUserCart = async (req, res) => {
  const cartItems = await cart.findOne({ userId: req.user.id }).populate({
    path: "products.productId",
    select: "name price images",
  });
  if (cartItems) {
    res.status(200).json({
      status: "success",
      cartItems,
    });
  } else {
    res.status(200).json({
      status: "success",
      data: {
        products: [],
      },
    });
  }
};

const updateUserCart = async (req, res) => {
  const { productId, quantity } = req.body;

  let cartItems = await cart.findOne({ userId: req.user.id });

  if (!cartItems) {
    cartItems = new cart({
      userId: req.user.id,
      products: [{ productId, quantity }],
    });
  } else {
    const productIndex = cartItems.products.findIndex(
      (product) => product.productId.toString() === productId.toString()
    );
    if (productIndex > -1) {
      cartItems.products[productIndex].quantity += quantity;
    } else {
      cartItems.products.push({ productId, quantity });
    }
  }
  const cartItemsSaved = await cartItems.save();
  await cartItemsSaved.populate({
    path: "products.productId",
    select: "name price images",
  });

  res.status(200).json({
    message: "cart updated",
  });
};

const removeFromCart = async (req, res) => {
  const { id } = req.params;
  const cartItem = await cart.findOneAndUpdate(
    {
      userId: req.user.id,
      "products.productId": id,
    },
    { $pull: { products: { productId: id } } },
    { new: true }
  );

  if (cartItem) {
    res.status(200).json({ message: "product removed from cart" });
  } else {
    res.status(404).json({ message: "cart not found" });
  }
};

export { getUserCart, updateUserCart, removeFromCart };
