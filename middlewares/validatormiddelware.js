const { validationResult } = require("express-validator");

// Make Validator For Requested Data 
const validatorMiddelWare = (req, res, next) => {
  // Return Error From Validator Method
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
module.exports = validatorMiddelWare;
