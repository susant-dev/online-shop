const { Router } = require("express");
const UserModel = require("./account-model");
const registerAccountRules = require("./middlewares/register-account-rules");
const { matchPassword } = require("../../shared/password-utils");
const { encodeToken } = require("../../shared/jwt-utils");
const loginAccountRules = require("./middlewares/login-account-rules");
const authorize = require("../../shared/middlewares/authorize");
const updateAccountRules = require("./middlewares/update-account-rules");
const passport = require("passport");
const OTPModel = require("./otp-model");
const sendEmail = require("../../shared/email-utils");
const verifyEmailRules = require("./middlewares/verify-email-rules");
const { randomNumberOfNDigits } = require("../../shared/compute-utils");

const accountsRoute = Router();

accountsRoute.post(
  "/accounts/register-customer",
  registerAccountRules,
  async (req, res) => {
    const newUser = req.body;
    const existingUser = await UserModel.findOne({
      email: newUser.email,
    });
    if (existingUser) {
      return res
        .status(500)
        .send({ errorMessage: `User with ${newUser.email} already exist` });
    }
    let addedUser = await UserModel.create(newUser);
    if (!addedUser) {
      return res
        .status(500)
        .send({ errorMessage: `Oops! User couldn't be added!` });
    }

    const otp = randomNumberOfNDigits(6);
    const emailData = await sendEmail(
      addedUser.email,
      `OnlineShop: Email verification`,
      `Your One Time Password for email verification is ${otp}`
    );
    if (emailData.rejected.length !== 0) {
      await OTPModel.create({
        account: addedUser._id,
        otp: otp,
        emailData: JSON.stringify(emailData),
      });
    }

    addedUser = addedUser.toObject();
    delete addedUser.password;
    res.json({ user: addedUser, action: `verify-email` });
  }
);

accountsRoute.get("/accounts/resend-otp/:email", async (req, res) => {
  const email = req.params.email;
  const foundUser = await UserModel.findById(email);
  if (!foundUser) {
    return res
      .status(404)
      .send({ errorMessage: `User with ${email} doesn't exist` });
  }
  const otp = randomNumberOfNDigits(6);
  const emailData = await sendEmail(
    addedUser.email,
    `OnlineShop: Email verification`,
    `Your One Time Password for email verification is ${otp}`
  );
  if (emailData.rejected.length !== 0) {
    let otpAccount = await OTPModel.findOne({ account: foundUser._id });
    if (!otpAccount) {
      otpAccount = await OTPModel.create({
        account: addedUser._id,
        otp: otp,
        emailData: JSON.stringify(emailData),
      });
    } else {
      otpAccount.otp = otp;
      otpAccount.emailData = JSON.stringify(emailData);
      otpAccount.save();
    }
  }
  return res.send({ message: `An email is sent to ${email} with a code.` });
});

accountsRoute.post(
  "/accounts/verify-email",
  verifyEmailRules,
  async (req, res) => {
    const { email, otp } = req.body;
    const foundUser = await UserModel.findOne({ email });
    if (!foundUser) {
      return res
        .status(404)
        .send({ errorMessage: `User with ${email} doesn't exist` });
    }
    if (foundUser.emailVerified) {
      return res.send({ message: `${email} is verified` });
    }
    const otpAccount = await OTPModel.findOne({ account: foundUser._id });
    if (!otpAccount || otpAccount.otp !== Number(otp)) {
      return res.status(400).send({ errorMessage: `OTP code didn't matched` });
    }
    foundUser.emailVerified = true;
    await foundUser.save();
    await OTPModel.findByIdAndDelete(otpAccount);
    return res.send({ message: `${email} is verified` });
  }
);

accountsRoute.post("/accounts/login", loginAccountRules, async (req, res) => {
  const { email, password } = req.body;
  const foundUser = await UserModel.findOne({ email });
  if (!foundUser) {
    return res
      .status(404)
      .send({ errorMessage: `User with ${email} doesn't exist` });
  }
  if (!foundUser.emailVerified) {
    const otp = randomNumberOfNDigits(6);
    const emailData = await sendEmail(
      addedUser.email,
      `OnlineShop: Email verification`,
      `Your One Time Password for email verification is ${otp}`
    );
    if (emailData.rejected.length !== 0) {
      let otpAccount = await OTPModel.findOne({ account: foundUser._id });
      if (!otpAccount) {
        otpAccount = await OTPModel.create({
          account: addedUser._id,
          otp: otp,
          emailData: JSON.stringify(emailData),
        });
      } else {
        otpAccount.otp = otp;
        otpAccount.emailData = JSON.stringify(emailData);
        otpAccount.save();
      }
    }

    return res.status(401).send({
      errorMessage: `Please verify the email before login. An email is sent to ${email} with a code.`,
      action: `verify-email`,
    });
  }
  const passwordMatched = matchPassword(password, foundUser.password);
  if (!passwordMatched) {
    return res
      .status(401)
      .send({ errorMessage: `Email and password didn't matched` });
  }
  const user = foundUser.toObject();
  delete user.password;
  // generate access token
  const token = encodeToken(user);
  // store user info in session
  // req.session.userId = user._id;
  res.json({ user, token });
});

accountsRoute.get(
  "/accounts/login/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

accountsRoute.get(
  "/accounts/login/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    const googleUser = req.user._json;
    const foundUser = await UserModel.findOne({
      email: googleUser.email,
    }).select("-password");
    let user = foundUser;
    if (!foundUser) {
      user = await UserModel.create({
        name: googleUser.name,
        email: googleUser.email,
        emailVerified: googleUser.email_verified,
        oauthProvider: "google",
      });
      if (!user) {
        return res
          .status(500)
          .send({ errorMessage: `Oops! User couldn't be added!` });
      }
    }
    user = user.toObject();
    delete user.password;
    // generate access token
    const token = encodeToken(user);
    return res.redirect(
      `http://localhost:5173?token=${token}&user=${encodeURIComponent(
        JSON.stringify(user)
      )}`
    );
    // return res.json({ user, token });
  }
);

accountsRoute.get("/accounts", authorize(["admin"]), async (req, res) => {
  const allUsers = await UserModel.find().select("-password");
  if (!allUsers) res.send([]);
  res.json(allUsers);
});

accountsRoute.get(
  "/accounts/:id",
  authorize(["admin", "customer"]),
  async (req, res) => {
    const userID = req.params.id;
    const isAdmin = req.account.roles.includes("admin");
    // If not admin, don't allow to access others account
    if (!isAdmin && userID !== req.account._id) {
      return res.status(401).json({
        errorMessage: "You don't have permission to access this account",
      });
    }
    const foundUser = await UserModel.findById(userID);
    if (!foundUser) {
      return res
        .status(404)
        .send({ errorMessage: `User with ${userID} doesn't exist` });
    }
    res.json(foundUser);
  }
);

accountsRoute.put(
  "/accounts/:id",
  authorize(["admin", "customer"]),
  updateAccountRules,
  async (req, res) => {
    const userID = req.params.id;
    const isAdmin = req.account.roles.includes("admin");
    // If not admin, don't allow to update others account
    if (!isAdmin && userID !== req.account._id) {
      return res.status(401).json({
        errorMessage: "You don't have permission to update this account",
      });
    }
    const newUser = req.body;
    if (!newUser) {
      return res.status(421).json({ errorMessage: "Nothing to update" });
    }
    // Only allow admin to change the roles
    if (!isAdmin && newUser.roles) {
      return res.status(401).json({
        errorMessage:
          "You don't have permission to update your role. Please contact the support team for the assistance!",
      });
    }
    const foundUser = await UserModel.findById(userID);
    if (!foundUser) {
      return res
        .status(404)
        .send({ errorMessage: `User with ${userID} doesn't exist` });
    }
    const updatedUser = await UserModel.findByIdAndUpdate(
      userID,
      {
        $set: newUser,
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res
        .status(500)
        .send({ errorMessage: `Oops! User couldn't be updated!` });
    }
    res.json(updatedUser);
  }
);

accountsRoute.delete(
  "/accounts/:id",
  authorize(["admin", "customer"]),
  async (req, res) => {
    const userID = req.params.id;
    const isAdmin = req.account.roles.includes("admin");
    // If not admin, don't allow to delete others account
    if (!isAdmin && userID !== req.account._id) {
      return res.status(401).json({
        errorMessage: "You don't have permission to delete this account",
      });
    }
    const foundUser = await UserModel.findById(userID);
    if (!foundUser) {
      return res
        .status(404)
        .send({ errorMessage: `User with ${userID} doesn't exist` });
    }
    const deletedUser = await UserModel.findByIdAndDelete(userID).select(
      "-password"
    );
    if (!deletedUser) {
      return res
        .status(500)
        .send({ errorMessage: `Oops! User couldn't be deleted!` });
    }
    res.json(deletedUser);
  }
);

module.exports = { accountsRoute };
