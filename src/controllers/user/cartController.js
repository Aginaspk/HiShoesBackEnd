import cart from "../../models/schema/cartSchema.js";

// const getUserCart = async (req, res) => {
//   const cartItems = await cart.findOne({ userId: req.user.id }).populate({
//     path: "products.productId",
//     select: "name price images",
//   });
//   if (cartItems) {
//     res.status(200).json({
//       status: "success",
//       cartItems,
//     });
//   } else {
//     res.status(200).json({
//       status: "success",
//       data: {
//         products: [],
//       },
//     });
//   }
// };


const getUserCart = async (req, res) => {
  const cartItems = await cart.findOne({ userId: req.user.id }).populate({
    path: "products.productId",
    select: "name price images",
  });

  if (cartItems) {
    let grandTotal = 0;
    cartItems.products.forEach((item) => {
      item.totalPrice = item.productId.price * item.quantity;
      grandTotal += item.totalPrice;
    });
    cartItems.totalPrice = grandTotal;

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
  const { productId, quantity, size } = req.body;

  let cartItems = await cart.findOne({ userId: req.user.id });

  if (!cartItems) {
    cartItems = new cart({
      userId: req.user.id,
      products: [{ productId, quantity,size }],
    });
  } else {
    const productIndex = cartItems.products.findIndex(
      (product) => product.productId.toString() === productId.toString() && product.size === size
    );
    if (productIndex > -1) {
      cartItems.products[productIndex].quantity += quantity;
    } else {
      cartItems.products.push({ productId, quantity,size });
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

// const updateUserCart = async (req, res) => {
//   const { productId, quantity, size } = req.body;

//   let cartItems = await cart.findOne({ userId: req.user.id });

//   if (!cartItems) {
//     cartItems = new cart({
//       userId: req.user.id,
//       products: [{ productId, quantity, size }],
//     });
//   } else {
//     const productIndex = cartItems.products.findIndex(
//       (product) =>
//         product.productId.toString() === productId.toString() &&
//         product.size === size
//     );
//     if (productIndex > -1) {
//       cartItems.products[productIndex].quantity += quantity;
//     } else {
//       cartItems.products.push({ productId, quantity, size });
//     }
//   }

//   await cartItems.populate({
//     path: "products.productId",
//     select: "name price images",
//   });

//   let grandTotal = 0;

//   cartItems.products.forEach((item) => {
//     const productTotalPrice = item.productId.price * item.quantity;

//     item.totalPrice = productTotalPrice;

//     grandTotal += productTotalPrice;
//   });

//   cartItems.totalPrice = grandTotal;

//   const cartItemsSaved = await cartItems.save();

//   res.status(200).json({
//     message: "Cart updated",
//   });
// };

const removeFromCart = async (req, res) => {
  const { id } = req.params;
  const cartItem = await cart.findOneAndUpdate(
    {
      userId: req.user.id,
    },
    { $pull: { products: { _id: id } } },
    { new: true }
  );

  if (cartItem) {
    res.status(200).json({ message: "product removed from cart" });
  } else {
    res.status(404).json({ message: "cart not found" });
  }
};

export { getUserCart, updateUserCart, removeFromCart };
