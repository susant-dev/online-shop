const { body } = require("express-validator");
const checkValidation = require("../../../shared/middlewares/check-validation");

const createCustomerRules = [
  body("name")
    .optional()
    .isString()
    .withMessage("Name must be a string")
    .trim(),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be a valid email address")
    .normalizeEmail(),

  body("phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^\d{3}-\d{3}-\d{4}$/)
    .withMessage("Phone number must be in the format XXX-XXX-XXXX"),

  body("address")
    .optional()
    .isString()
    .withMessage("Address must be a string")
    .trim(),

  checkValidation,
];

module.exports = createCustomerRules;
