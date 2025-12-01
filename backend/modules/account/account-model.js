const mongoose = require("mongoose");
const { encodePassword } = require("../../shared/password-utils");

const accountSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, required: true, unique: true },
    emailVerified: { type: Boolean, default: false },
    phone: String,
    phoneVerified: { type: Boolean, default: false },
    password: {
      type: String,
      required: function () {
        return this.oauthProvider === "local";
      },
    },
    roles: {
      type: [String],
      enum: ["admin", "customer"],
      required: true,
      default: ["customer"],
    },
    oauthProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    address: String,
    myCart: { type: mongoose.Schema.Types.ObjectId, ref: "Cart" },
    createdAt: { type: Date, default: Date.now() },
  },
  { versionKey: false }
);

accountSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = encodePassword(this.password);
    next();
  } catch (err) {
    next(err);
  }
});

accountSchema.pre("save", async function (next) {
  if (this.myCart) return next();
  const cart = await mongoose.model("Cart").create({});
  this.myCart = cart._id;
  next();
});

const AccountModel = mongoose.model("Account", accountSchema);

module.exports = AccountModel;
