const { body } = require("express-validator");
const checkValidation = require("../../../shared/middlewares/check-validation");

const updateAccountRules = [
  body("name")
    .optional()
    .isString()
    .withMessage("Name must be a string")
    .trim(),

  body("email")
    .optional()
    .isEmail()
    .withMessage("Email must be a valid email address")
    .normalizeEmail(),

  body("phone")
    .optional()
    .matches(/^\d{3}-\d{3}-\d{4}$/)
    .withMessage("Phone number must be in the format XXX-XXX-XXXX"),

  body("address")
    .optional()
    .isString()
    .withMessage("Address must be a string")
    .trim(),

  checkValidation,
];

module.exports = updateAccountRules;
