/**
 * Instructions:
 *
 * 1. Start by importing Mongoose in your file.
 *
 * 2. Create CartProductSchema
 *    - This schema will represent each product added to the cart.
 *    - It should include:
 *          - item: ObjectId reference to the Product model.
 *          - qty: Number, with a minimum value of 0.
 *          - price: Number, with a minimum value of 0.
 *
 * 3. Create CartSchema
 *    - The main cart will contain:
 *          - products: an array of CartProductSchema items.
 *          - subtotal: Number (default 0).
 *          - hst: Number (default 0).
 *          - total: Number (default 0).
 *
 * 4. Use a Mongoose Pre-Save Hook
 *    - Before saving a cart, calculate:
 *          - subtotal = sum of all product prices.
 *          - hst = 15% of subtotal.
 *          - total = subtotal + hst.
 *
 * 5. Create the Model and Export
 */
const mongoose = require("mongoose");

const CartProductSchema = new mongoose.Schema({
  item: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  qty: { type: Number, min: 0, default: 0 },
  price: { type: Number, min: 0, default: 0 },
});

const CartSchema = new mongoose.Schema({
  products: { type: [CartProductSchema], default: [] },
  subtotal: { type: Number, min: 0, default: 0 },
  hst: { type: Number, min: 0, default: 0 },
  total: { type: Number, min: 0, default: 0 },
});

CartSchema.pre("save", async function (next) {
  this.subtotal = this.products.reduce((a, c) => (a = a + c.price), 0);
  this.hst = this.subtotal * 0.15;
  this.total = this.subtotal + this.hst;
  next();
});

const CartModel = mongoose.model("Cart", CartSchema);

module.exports = CartModel;
