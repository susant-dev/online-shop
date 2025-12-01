const { body } = require("express-validator");
const checkValidation = require("../../../shared/middlewares/check-validation");

const loginAccountRules = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be a valid email address")
    .normalizeEmail(),

  body("password").notEmpty().withMessage("Password is required"),

  checkValidation,
];

module.exports = loginAccountRules;
