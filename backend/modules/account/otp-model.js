const mongoose = require("mongoose");

const OTPSchema = new mongoose.Schema({
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true,
    unique: true,
  },
  otp: { type: mongoose.Schema.Types.Number, required: true },
  emailData: { type: mongoose.Schema.Types.String, default: null },
  createdAt: { type: Date, default: Date.now(), expires: 60 * 5 },
});

const OTPModel = mongoose.model("OTPModel", OTPSchema);

module.exports = OTPModel;
