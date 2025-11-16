const { body } = require("express-validator");
const checkValidation = require("../../../shared/middlewares/check-validation");

const updateCartRules = [
  body("productId")
    .notEmpty()
    .withMessage("productId is required")
    .isString()
    .withMessage("productId must be a string"),
  body("qty")
    .notEmpty()
    .withMessage("qty is required")
    .isInt({ min: 1 })
    .withMessage("qty must be a number greater than or equal to 1"),
  checkValidation,
];

module.exports = updateCartRules;
