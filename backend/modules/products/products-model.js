const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  product_name: { type: String, required: true, minLength: 6 },
  description: { type: String, maxLength: 500, default: "" },
  price: { type: Number, min: 0 },
  category: { type: String, required: true },
  createdAt: { type: Date, default: Date.now() },
});

const ProductModel = mongoose.model("Product", ProductSchema);

module.exports = ProductModel;
