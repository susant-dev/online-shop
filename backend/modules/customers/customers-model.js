const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: String,
  myCart: { type: mongoose.Schema.Types.ObjectId, ref: "Cart" },
  createdAt: { type: Date, default: Date.now() },
});

customerSchema.pre("save", async function (next) {
  if (this.myCart) next();
  const cart = await mongoose.model("Cart").create({});
  this.myCart = cart._id;
  next();
});

const CustomerModel = mongoose.model("Customer", customerSchema);

module.exports = CustomerModel;
