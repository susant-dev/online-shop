const { Router } = require("express");
const CartModel = require("./carts-model");
const mongoose = require("mongoose");
const updateCartRules = require("./middlewares/update-cart-rules");

const cartsRoute = Router();

/**
 * TODO 1:
 * - Retrieve a specific cart using the provided cartID.
 * - Use Mongoose to find the cart by its ID from the database.
 * - Populate the "products" field in the cart with the CartProduct, also populate its related "item" field with the Product model.
 * - If the cart does not exist, respond with a 404 error message.
 * - If found, return the complete cart data as a JSON response.
 */
cartsRoute.get("/carts/:cartId", async (req, res) => {
  const cartID = req.params.id;
  const foundCart = await CartModel.findById(cartID).populate({
    path: "products",
    populate: { path: "item", populate: "Product" },
  });
  if (!foundCart) {
    return res.status(404).send(`Cart with ${cartID} doesn't exist`);
  }
  res.json(foundCart);
});

/**
 * TODO 2:
 * - In Request Body, you will get: `productId` (id of the product to add or update) and `qty` (quantity of that product)
 * - Find the cart by id using dynamic route parameter `cartId`; if not found, return a 404 error.
 * - Retrieve the product (ProductModel) based on the provided productId in the request body.
 * - If the product doesn’t exist, respond with a 404 error.
 * - Calculate the price (product price * quantity).
 * - Check if the product already exists in the cart:
 *    - If it does, update its quantity and price.
 *    - If not, add it as a new item in the products array.
 * - Save the updated cart and re-populate product details before sending the response.
 * - Return the updated cart as JSON.
 */
cartsRoute.put("/carts/:cartId", updateCartRules, async (req, res, next) => {
  const cartID = req.params.cartID;
  const foundCart = await CartModel.findById({ _id: cartID });
  if (!foundCart) {
    return res.status(404).send(`Cart with ${cartID} doesn't exist`);
  }

  const ProductModel = mongoose.model("Product");
  const foundProduct = await ProductModel.findById(productID);
  if (!foundProduct) {
    return res.status(404).send(`Product with ${productID} doesn't exist`);
  }

  const qty = req.body.qty;
  const price = foundProduct.price * qty;

  const index = foundCart.products.findIndex(
    (product) => product.item === foundProduct.id
  );
  if (index < 0) {
    foundCart.products.push({ item: foundProduct._id, qty, price });
  } else {
    foundCart.products[index] = { item: foundProduct._id, qty, price };
  }

  await foundCart.save();
  const updatedCart = await foundCart.populate({
    path: "products",
    populate: { path: "item" },
  });
  res.json(updatedCart);
});

module.exports = { cartsRoute };
